import _ from 'lodash'

import { Logger } from '../../shared/logger'
import { OrderLineItem } from '../../shared/types/order'
import { ProductModel } from '../models/product.'
import {
  RoastedCoffeeProductMap,
  RoastedCoffeeMap,
  GreenCoffeeMap,
  BATCH_SIZE,
} from './roasting_settings'

interface RoastableLineItem {
  greenCoffee: number
  greenCoffeeName: string
  roastedCoffee: number
  roastedCoffeeName: string
  totalWeight: number
  orderId: number
}

interface Roasting {
  greenCoffee: Record<
    number,
    {
      name: string
      weight: number
    }
  >
  roastedCoffee: Record<
    number,
    {
      name: string
      weight: number
      numberOfBatches?: number
    }
  >

  totalWeight: number
  orders: number[]
}

export const isLineItemRoastable = (lineItem: OrderLineItem) => {
  if (!RoastedCoffeeProductMap[lineItem.productId]) {
    Logger.debug(`Item not roastable`, lineItem)
  }

  return !!RoastedCoffeeProductMap[lineItem.productId]
}

export const mapLineItemForRoasting = async (
  lineItem: OrderLineItem & { orderId }
): Promise<RoastableLineItem> => {
  const product = await ProductModel.findOne({
    id: lineItem.productId,
  })
  const roastedCoffee =
    RoastedCoffeeMap[RoastedCoffeeProductMap[lineItem.productId]]

  const greenCoffee = GreenCoffeeMap[roastedCoffee.greenCoffeeId]

  const variation = product.variations.find(
    (variation) => variation.id === lineItem.variationId
  )

  if (!variation) {
    throw new Error('Missing product variation')
  }

  const totalWeight = lineItem.quantity * variation.weight

  return {
    greenCoffee: greenCoffee.id,
    greenCoffeeName: greenCoffee.name,
    roastedCoffee: roastedCoffee.id,
    roastedCoffeeName: roastedCoffee.name,
    totalWeight,
    orderId: lineItem.orderId,
  }
}

export const reduceLineItemsForRoasting = (
  roastableLineItems: RoastableLineItem[]
): Roasting => {
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

  return roastableLineItems.reduce((memo, item) => {
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
}

export const mapRoastingBatches = (roasting: Roasting): Roasting => {
  return {
    greenCoffee: roasting.greenCoffee,
    roastedCoffee: Object.entries(roasting.roastedCoffee).reduce(
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
    totalWeight: roasting.totalWeight,
    orders: _.uniq(roasting.orders),
  }
}
