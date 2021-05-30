import _ from 'lodash'

import { ProductModel } from '../models/product.'
import {
  RoastedCoffeeMap,
  GreenCoffeeMap,
  BATCH_SIZE,
} from './roasting-settings'
import { OrderDocument } from './../models/order'

export const processOrdersToBatches = async (orders: OrderDocument[]) => {
  const lineItems = orders.flatMap((order) =>
    order.toObject().lineItems.map((item) => ({ ...item, orderId: order.id }))
  )

  const lineItemsWithProducts = await Promise.all(
    lineItems.map(async (lineItem) => {
      const product = await ProductModel.findOne({
        id: lineItem.productId,
      })

      return { ...lineItem, product }
    })
  )

  const roastableLineItems = lineItemsWithProducts
    .filter((item) => item.product.roastedCoffeeCategoryId)
    .map((item) => {
      const roastedCoffee =
        RoastedCoffeeMap[item.product.roastedCoffeeCategoryId]

      const greenCoffee = GreenCoffeeMap[roastedCoffee.greenCoffeeId]

      const variation = item.product.variations.find(
        (variation) => variation.id === item.variationId
      )

      if (!variation) {
        throw new Error('Missing product variation')
      }

      const totalWeight = item.quantity * variation.weight

      return {
        greenCoffee: greenCoffee.id,
        greenCoffeeName: greenCoffee.name,
        roastedCoffee: roastedCoffee.id,
        roastedCoffeeName: roastedCoffee.name,
        totalWeight,
        orderId: item.orderId,
      }
    })

  const startingValues = {
    greenCoffee: Object.values(GreenCoffeeMap).reduce((memo, value) => {
      return { ...memo, [value.id]: { name: value.name, weight: 0 } }
    }, []),
    roastedCoffee: Object.values(RoastedCoffeeMap).reduce((memo, value) => {
      return { ...memo, [value.id]: { name: value.name, weight: 0 } }
    }, []),
    totalWeight: 0,
    orders: [],
  }

  const preliminaryRoastingData = roastableLineItems.reduce((memo, item) => {
    memo = {
      greenCoffee: {
        ...memo.greenCoffee,
        [item.greenCoffee]: {
          ...memo.greenCoffee[item.greenCoffee],
          weight: memo.greenCoffee[item.greenCoffee].weight + item.totalWeight,
        },
      },
      roastedCoffee: {
        ...memo.roastedCoffee,
        [item.roastedCoffee]: {
          ...memo.roastedCoffee[item.roastedCoffee],
          weight:
            memo.roastedCoffee[item.roastedCoffee].weight + item.totalWeight,
        },
      },
      totalWeight: memo.totalWeight + item.totalWeight,
      orders: [...memo.orders, item.orderId],
    }
    return memo
  }, startingValues)

  return {
    greenCoffee: preliminaryRoastingData.greenCoffee,
    roastedCoffee: Object.entries(preliminaryRoastingData.roastedCoffee).reduce(
      (memo, [key, item]) => {
        return {
          ...memo,
          [key]: {
            ...item,
            numberOfBatches: Math.ceil(item.weight / BATCH_SIZE),
          },
        }
      },
      {}
    ),
    totalWeight: preliminaryRoastingData.totalWeight,
    orders: _.uniq(preliminaryRoastingData.orders),
  }
}
