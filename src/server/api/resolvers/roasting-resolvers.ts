
import { Logger } from './../../../shared/logger'
import { RoastingService } from '../../services/roasting-service'
import { RoastingDocument } from './../../models/roasting'
import { RoastingModel } from '../../models/roasting'
import { getOrder } from './order-resolvers'

const mapRoasting = (item: RoastingDocument) => {
  return {
    id: item.id,
    dateCreated: item.dateCreated,
    datePlanningClosed: item.datePlanningClosed,
    dateFinished: item.dateFinished,

    status: item.status,
    totalWeight: item.totalWeight,
    orderIds: item.orders,
    orders: () => Promise.all(item.orders.map((id) => getOrder(id))),
    greenCoffee: item.greenCoffee,
    roastedCoffee: item.roastedCoffee,
  }
}

const getRoastings = async () => {
  const entities = await RoastingModel.find().sort({ id: -1 })
  return entities.map(mapRoasting)
}

export const buildRoastingResolvers = (roastingService: RoastingService) => {
  const finishRoastingResolver = async () => {
    try {
      await roastingService.finishRoasting()
      return {
        success: true,
      }
    } catch (e) {
      Logger.error(`Error handling finish roasting mutation`, e)
      return {
        success: false,
      }
    }
  }

  const closePlanningResolver = async () => {
    try {
      await roastingService.closeRoastingPlanning()
      return {
        success: true,
      }
    } catch (e) {
      Logger.error(`Error handling close planning mutation`, e)
      return {
        success: false,
      }
    }
  }

  return {
    finishRoastingResolver,
    closePlanningResolver,
    getRoastings,
  }
}

