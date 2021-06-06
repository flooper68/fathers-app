import { getOrders } from './order-resolvers'
import { getProducts } from './product-resolvers'
import { getGreenCoffees } from './green-coffee-resolvers'
import { getRoastedCoffees } from './roasted-coffee-resolvers'
import { SyncService } from '../../services/data-sync/data-sync'
import { RoastingService } from '../../services/roasting-service'

export const buildAppResolver = (
  syncService: SyncService,
  roastingService: RoastingService
) => {
  const roastingResolvers = buildRoastingResolvers(roastingService)

  return {
    sync: syncService.getSyncState,
    greenCoffees: getGreenCoffees,
    roastedCoffees: getRoastedCoffees,
    products: getProducts,
    orders: getOrders,
    roastings: roastingResolvers.getRoastings,
    finishRoasting: roastingResolvers.finishRoastingResolver,
    closePlanning: roastingResolvers.closePlanningResolver,
    synchronizeProducts: syncService.syncProducts,
  }
