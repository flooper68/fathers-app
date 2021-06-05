import { RoastingDocument } from './../../models/roasting'
import { RoastingModel } from '../../models/roasting'
import { getOrder } from './order-resolvers'

const mapRoasting = (item: RoastingDocument) => {
  return {
    id: item.id,
    status: item.status,
    totalWeight: item.totalWeight,
    orderIds: item.orders,
    orders: () => Promise.all(item.orders.map((id) => getOrder(id))),
  }
}

export const getRoastings = async () => {
  const entities = await RoastingModel.find().sort({ id: -1 })
  return entities.map(mapRoasting)
}
