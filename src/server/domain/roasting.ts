import _ from 'lodash'

import { ProductModel } from '../models/product.'
import {
  RoastedCoffeeMap,
  GreenCoffeeMap,
  BATCH_SIZE,
} from './roasting-settings'
import { OrderDocument } from './../models/order'
import {
  RoastingGreenCoffee,
  RoastingRoastedCoffee,
  RoastingStatus,
} from '../../shared/types/roasting'
import { RoastedCoffee } from '../../shared/types/roasted-coffee'
import { GreenCoffee } from './../../shared/types/green-coffee'
import { RoastingModel } from './../models/roasting'

export const processOrdersToBatches = async (orders: OrderDocument[]) => {
  const lineItems = orders
    .map((order) =>
      order.toObject().lineItems.map((item) => ({ ...item, orderId: order.id }))
    )
    .flat()

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
      const roastedCoffee: RoastedCoffee =
        RoastedCoffeeMap[item.product.roastedCoffeeCategoryId]

      const greenCoffee: GreenCoffee =
        GreenCoffeeMap[roastedCoffee.greenCoffeeId]

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
    greenCoffee: Object.values(GreenCoffeeMap).reduce<
      Record<number, RoastingGreenCoffee>
    >((memo, value) => {
      return {
        ...memo,
        [value.id]: { name: value.name, weight: 0, id: value.id },
      }
    }, {}),
    roastedCoffee: Object.values(RoastedCoffeeMap).reduce<
      Record<number, RoastingRoastedCoffee>
    >((memo, value) => {
      return {
        ...memo,
        [value.id]: {
          name: value.name,
          weight: 0,
          id: value.id,
          numberOfBatches: 0,
          finishedBatches: 0,
        },
      }
    }, []),
    totalWeight: 0,
    orders: [] as number[],
  }

  const preliminaryRoastingData = roastableLineItems.reduce<
    typeof startingValues
  >((memo, item) => {
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
    greenCoffee: Object.values(preliminaryRoastingData.greenCoffee),
    roastedCoffee: Object.values(preliminaryRoastingData.roastedCoffee).map(
      (item) => {
        return {
          ...item,
          numberOfBatches: Math.ceil(item.weight / BATCH_SIZE),
        }
      }
    ),
    totalWeight: preliminaryRoastingData.totalWeight,
    orders: _.uniq(preliminaryRoastingData.orders),
  }
}

export const getNextPlannedRoasting = async () => {
  const roastings = await RoastingModel.find({
    status: RoastingStatus.PLANNED,
  })

  if (roastings.length > 1) {
    throw new Error('There is more than one planned roasting')
  }

  let nextRoasting = roastings[0]

  if (!nextRoasting) {
    nextRoasting = new RoastingModel()
    await nextRoasting.save()
  }

  return nextRoasting
}
