import { RoastingService } from '../roasting-service'
import { Logger } from '../../../shared/logger'
import { WooCommerceOrderResponse, Order } from '../../../shared/types/order'
import { OrderModel } from '../../models/order'
import { runPromisesInSequence } from '../../promise-utils'
import { WooCommerceClient } from '../woocommerce'

const mapOrder = (order: WooCommerceOrderResponse): Order => {
  return {
    id: order.id,
    number: order.number,
    dateCreated: order.date_created,
    dateModified: order.date_modified,
    status: order.status,
    lineItems: order.line_items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        productName: item.parent_name,
        productId: item.product_id,
        variationId: item.variation_id,
        quantity: item.quantity,
      }
    }),
    roasted: false,
  }
}

const syncOrder = async (order: Order) => {
  const dbEntity = await OrderModel.findOne({
    id: order.id,
  }).exec()

  if (dbEntity) {
    Logger.debug(`Order ${order.id} exists`)

    if (dbEntity.dateModified !== order.dateModified) {
      Logger.info(`Order ${order.id} was modified, updating`)
      await dbEntity.updateOne(order)
      return
    } else {
      Logger.debug(`Order ${order.id} was not modified`)
      return
    }
  } else {
    Logger.info(`Order ${order.id} does not exist, creating new entry`)
    const dbEntity = new OrderModel(order)
    await dbEntity.save()
  }
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

const mapLineItemForRoasting = async (lineItem) => {
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
    return
  }

  const itemsRoastingData = await Promise.all(
    order.lineItems.map(mapLineItemForRoasting)
  )

  const orderRoastingData = itemsRoastingData.reduce(
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

  await plannedRoasting.updateOne(updatedRoastingData)
  await OrderModel.updateOne(
    { id: order.id },
    { roastingId: plannedRoasting.id }
  )

  Logger.info(`Updated roasting ${plannedRoasting.id} with order ${order.id}`)
}

export const buildSyncNewOrders = (
  client: WooCommerceClient,
  roastingService: RoastingService
) => async () => {
  const start = Date.now()
  Logger.info('Syncing new orders')

  const result = await client.getNewOrders()
  const orders: Order[] = result.rows.map(mapOrder)

  Logger.info(`Fetched ${result.totalCount} orders`)

  let changeCounter = 0
  const handleNewOrder = async (order: Order) => {
    await syncOrder(order)
    const addedToRoasting = await roastingService.processOrderForRoasting(order)
    if (addedToRoasting) {
      changeCounter++
    }
  }

  await runPromisesInSequence(orders, handleNewOrder)

  const stop = Date.now()
  Logger.info(`Syncing orders finished, took ${stop - start} ms`)
  return changeCounter
}

export const buildSyncUnresolvedOrders = (
  client: WooCommerceClient,
  roastingService: RoastingService
) => async () => {
  const start = Date.now()
  Logger.info('Syncing unresolved orders')

  const result = await client.getUnresolvedOrders()
  const orders: Order[] = result.rows.map(mapOrder)

  Logger.info(`Fetched ${result.totalCount} orders`)
  let changeCounter = 0

  const handleOrder = async (order: Order) => {
    await syncOrder(order)
    const addedToRoasting = await roastingService.processOrderForRoasting(order)
    if (addedToRoasting) {
      changeCounter++
    }
  }

  await runPromisesInSequence(orders, handleOrder)

  const stop = Date.now()
  Logger.info(`Syncing orders finished, took ${stop - start} ms`)
  return changeCounter
}
