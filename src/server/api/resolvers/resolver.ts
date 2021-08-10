import { getOrders } from './order-resolvers';
import { getProducts } from './product-resolvers';
import { getGreenCoffees } from './green-coffee-resolvers';
import { getRoastedCoffees } from './roasted-coffee-resolvers';
import { buildRoastingResolvers } from './roasting-resolvers';
import { SyncService } from '../../services/data-sync/data-sync';

export const buildAppResolver = (syncService: SyncService) => {
  const roastingResolvers = buildRoastingResolvers();

  return {
    sync: syncService.getSyncState,
    greenCoffees: getGreenCoffees,
    roastedCoffees: getRoastedCoffees,
    products: getProducts,
    orders: getOrders,

    //Roasting queries
    roastings: roastingResolvers.getRoastingsResolver,

    //Roasting mutations
    createRoasting: roastingResolvers.createRoastingResolver,
    selectOrdersRoasting: roastingResolvers.selectOrdersRoastingResolver,
    finishRoasting: roastingResolvers.finishRoastingResolver,
    finishBatch: roastingResolvers.finishBatchResolver,
    reportRealYield: roastingResolvers.reportRealYieldResolver,
    startRoasting: roastingResolvers.startRoastingResolver,
    synchronizeProducts: syncService.syncProducts,
  };
};
