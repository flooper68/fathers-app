import DataLoader from 'dataloader'

import { OrderDocument, OrderModel } from '../../models/order'
import { getProduct } from './product-resolvers'

const orderLoader = new DataLoader(async (keys: readonly number[]) => {
  return await OrderModel.find({ id: { $in: keys as number[] } })
})

const mapOrder = (item: OrderDocument) => {
  return {
    id: item.id,
    number: item.number,
    status: item.status,
    dateCreated: item.dateCreated,
    dateModified: item.dateModified,
    roastingId: item.roastingId,
    roasted: item.roasted,
    lineItems: item.lineItems.map((lineItem) => {
      return {
        id: lineItem.id,
        name: lineItem.name,
        productName: lineItem.productName,
        productId: lineItem.productId,
        variationId: lineItem.variationId,
        quantity: lineItem.quantity,
        product: () => getProduct(lineItem.productId),
      }
    }),
  }
}

export const getOrder = async (id: number) => {
  const item = await orderLoader.load(id)
  return mapOrder(item)
}

export const getOrders = async (params: { page: number }) => {
  console.log(params.page)
  const page = params.page || 1
  const PAGE_SIZE = 100

  const entities = await OrderModel.find()
    .sort({ number: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)

  const count = await OrderModel.estimatedDocumentCount()

  return {
    page,
    pageCount: Math.ceil(count / PAGE_SIZE),
    rows: entities.map(mapOrder),
  }
}
