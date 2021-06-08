import { OrderLineItem } from './../../shared/types/order'
import { Logger } from './../../shared/logger'
import { RoastingStatus } from '../../shared/types/roasting'
import { RoastingModel } from '../models/roasting'
import { GreenCoffee } from '../../shared/types/green-coffee'
import { OrderStatus, Order } from '../../shared/types/order'
import { RoastedCoffee } from '../../shared/types/roasted-coffee'
import { OrderModel } from '../models/order'
import { ProductModel } from '../models/product.'
import { GreenCoffeeMap, RoastedCoffeeMap } from '../roasting-settings'

const READY_FOR_ROASTING_STATUSES = [
  OrderStatus.ON_HOLD,
  OrderStatus.PROCESSING,
  OrderStatus.COMPLETED,
]

const getEmptyRoastingObject = () => {
  return {
    greenCoffee: Object.values(GreenCoffeeMap).map((greenCoffe) => ({
      ...greenCoffe,
      weight: 0,
    })),
    roastedCoffee: Object.values(RoastedCoffeeMap).map(
      ({ greenCoffeeId, ...roastedCoffee }) => ({
        ...roastedCoffee,
        weight: 0,
        numberOfBatches: 0,
        finishedBatches: 0,
        realYield: 0,
      })
    ),
    totalWeight: 0,

    orders: [] as number[],
  }
}

export type RoastingObject = ReturnType<typeof getEmptyRoastingObject>

const mergeRoastingData = (
  memo: RoastingObject,
  roastingData: RoastingObject
): RoastingObject => {
  return {
    totalWeight: memo.totalWeight + roastingData.totalWeight,
    orders: [...memo.orders, ...roastingData.orders],
    greenCoffee: memo.greenCoffee.map((greenCoffee) => {
      const coffee = roastingData.greenCoffee.find(
        (item) => item.id === greenCoffee.id
      )

      if (!coffee) {
        throw new Error(`Invalid state - missing green coffee item for merge`)
      }
      return {
        ...greenCoffee,
        weight: greenCoffee.weight + coffee.weight,
      }
    }),
    roastedCoffee: memo.roastedCoffee.map((roastedCoffee) => {
      const coffee = roastingData.roastedCoffee.find(
        (item) => item.id === roastedCoffee.id
      )

      if (!coffee) {
        throw new Error(`Invalid state - missing roasted coffee item for merge`)
      }
      return {
        ...roastedCoffee,
        weight: roastedCoffee.weight + coffee.weight,
        numberOfBatches: roastedCoffee.numberOfBatches + coffee.numberOfBatches,
      }
    }),
  }
}

const getNextPlannedRoasting = async () => {
  const roastings = await RoastingModel.find({
    status: RoastingStatus.IN_PLANNING,
  })

  if (roastings.length > 1) {
    throw new Error('There is more than one planned roasting')
  }

  let nextRoasting = roastings[0]

  if (!nextRoasting) {
    Logger.debug(`There is no planned roasting, creating new one`)
    nextRoasting = new RoastingModel(getEmptyRoastingObject())
    await nextRoasting.save()
  }

  return nextRoasting
}

const closeRoastingPlanning = async () => {
  const roastings = await RoastingModel.find({
    status: RoastingStatus.IN_PLANNING,
  })

  if (roastings.length > 1) {
    throw new Error('There is more than one planned roasting')
  }

  const roastingsInProgress = await RoastingModel.find({
    status: RoastingStatus.IN_PROGRESS,
  })

  if (roastingsInProgress.length > 0) {
    throw new Error(
      'Can not close roasting plannaning, old roasting is still in progress'
    )
  }

  Logger.info(`Closing planning for roasting ${roastings[0].id}`)

  const closedRoasting = roastings[0]
  await closedRoasting.updateOne({
    status: RoastingStatus.IN_PROGRESS,
    datePlanningClosed: new Date().toISOString(),
  })

  const nextRoasting = new RoastingModel(getEmptyRoastingObject())
  await nextRoasting.save()

  Logger.info(`Created new roasting in planning ${nextRoasting.id} `)
}

const finishRoasting = async () => {
  const roastings = await RoastingModel.find({
    status: RoastingStatus.IN_PROGRESS,
  })

  if (roastings.length > 1) {
    throw new Error('There is more than one roasting in progress')
  }

  Logger.info(`Finished roasting ${roastings[0].id}`)
  const finishedRoasting = roastings[0]
  await finishedRoasting.updateOne({
    status: RoastingStatus.FINISHED,
    dateFinished: new Date().toISOString(),
  })
}

const getItemRoastingData = (
  totalWeight: number,
  greenCoffeeId: number,
  lossFactor: number,
  batchWeight: number,
  roastedCoffeeId: number
) => {
  const roastingData = getEmptyRoastingObject()

  roastingData.totalWeight += totalWeight
  Logger.debug(`Total weight ${totalWeight}`)

  roastingData.greenCoffee = roastingData.greenCoffee.map((coffee) => {
    if (coffee.id === greenCoffeeId) {
      Logger.debug(
        `Green coffee ${coffee.name}, amount ${totalWeight / lossFactor}`
      )
      return {
        ...coffee,

        weight: totalWeight / lossFactor,
      }
    }
    return coffee
  })

  roastingData.roastedCoffee = roastingData.roastedCoffee.map((coffee) => {
    if (coffee.id === roastedCoffeeId) {
      Logger.debug(
        `Roasted coffee ${coffee.name}, amount ${totalWeight}, batches ${
          totalWeight / lossFactor / batchWeight
        }`
      )
      return {
        ...coffee,
        weight: totalWeight,
        numberOfBatches: totalWeight / lossFactor / batchWeight,
      }
    }
    return coffee
  })

  return roastingData
}

const mapLineItemForRoasting = async (lineItem: OrderLineItem) => {
  const product = await ProductModel.findOne({
    id: lineItem.productId,
  })

  if (!product) {
    throw new Error(
      `Invalid state - missing product ${lineItem.productId} in database, try syncing products with WooCommerce`
    )
  }

  if (!product?.roastedCoffeeId) {
    Logger.info(`Product ${product.name} is not roastable, skipping`)
    return
  }

  const roastedCoffee: RoastedCoffee = RoastedCoffeeMap[product.roastedCoffeeId]

  const greenCoffee: GreenCoffee = GreenCoffeeMap[roastedCoffee.greenCoffeeId]

  const variation = product.variations.find(
    (variation) => variation.id === lineItem.variationId
  )

  if (!variation) {
    throw new Error('Missing product variation')
  }

  if (!variation.weight) {
    throw new Error('Variation is missing weight')
  }

  const totalWeight = lineItem.quantity * variation.weight

  Logger.info(
    `Processing item ${lineItem.id} with product ${product.name} for roasting`
  )
  return getItemRoastingData(
    totalWeight,
    greenCoffee.id,
    greenCoffee.roastingLossFactor,
    greenCoffee.batchWeight,
    roastedCoffee.id
  )
}

const processOrderForRoasting = async (order: Order) => {
  if (!READY_FOR_ROASTING_STATUSES.includes(order.status)) {
    Logger.info(
      `Skipping roasting processing for order ${order.id}, status ${order.status}`
    )
    return false
  }

  const itemsRoastingData = await Promise.all(
    order.lineItems.map(mapLineItemForRoasting)
  )

  const roastableItems = itemsRoastingData.filter(
    (item) => item !== undefined
  ) as RoastingObject[]

  if (roastableItems.length === 0) {
    Logger.info(
      `Skipping roasting processing for order ${order.id}, there are no roastable items`
    )
    return false
  }

  const orderRoastingData = roastableItems.reduce<RoastingObject>(
    mergeRoastingData,
    getEmptyRoastingObject()
  )

  orderRoastingData.orders = [order.id]

  Logger.debug(`Order line items roasting data aggregated`)

  const plannedRoasting = await getNextPlannedRoasting()

  const updatedRoastingData = mergeRoastingData(
    plannedRoasting.toObject(),
    orderRoastingData
  )

  if (plannedRoasting.orders.some((item) => item === order.id)) {
    throw new Error(`One order is processed twice for same roasting`)
  }

  await plannedRoasting.updateOne(updatedRoastingData)
  await OrderModel.updateOne(
    { id: order.id },
    { roastingId: plannedRoasting.id }
  )

  Logger.info(`Updated roasting ${plannedRoasting.id} with order ${order.id}`)
  return true
}

export const buildRoastingService = () => {
  getNextPlannedRoasting().then((roasting) =>
    Logger.debug(`Next roasting is ${roasting.id}`)
  )

  return {
    processOrderForRoasting,
    getNextPlannedRoasting,
    finishRoasting,
    closeRoastingPlanning,
    mergeRoastingData,
    getEmptyRoastingObject,
  }
}

export type RoastingService = ReturnType<typeof buildRoastingService>
