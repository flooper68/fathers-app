import { buildDataLoaders } from './../data-loaders/data-loaders';
import { SalesModule } from '../../modules/sales/sales-contracts';
import { CatalogModule } from '../../modules/catalog/catalog-contracts';
import { RoastingModule } from '../../modules/roasting/roasting-contracts';
import {
  GreenCoffeeRepository,
  RoastedCoffeeRepository,
  RoastingProductRepository,
} from '../../modules/roasting/roasting-contracts';
import { buildProductResolvers } from './product-resolvers';
import { buildGreenCoffeeResolvers } from './green-coffee-resolvers';
import { buildRoastedCoffeeResolvers } from './roasted-coffee-resolvers';
import { buildRoastingResolvers } from './roasting-resolvers';
import { SyncService } from '../../services/data-sync/data-sync';
import { buildOrderResolvers } from './order-resolvers';

export const buildAppResolver = (context: {
  syncService: SyncService;
  greenCoffeeRepository: GreenCoffeeRepository;
  roastedCoffeeRepository: RoastedCoffeeRepository;
  roastingProductRepository: RoastingProductRepository;
  roastingModule: RoastingModule;
  catalogModule: CatalogModule;
  salesModule: SalesModule;
}) => {
  const dataLoaders = buildDataLoaders(context);
  const roastingResolvers = buildRoastingResolvers({ ...context, dataLoaders });
  const greenCoffeeResolvers = buildGreenCoffeeResolvers(context);
  const roastedCoffeeResolvers = buildRoastedCoffeeResolvers(context);
  const productResolvers = buildProductResolvers(context);
  const orderResolvers = buildOrderResolvers({ ...context, dataLoaders });

  return {
    //Sync resolvers
    sync: context.syncService.getSyncState,

    //Orders resolvers
    orders: orderResolvers.getOrders,

    //GreenCoffee resolvers
    greenCoffees: greenCoffeeResolvers.getAllGreenCoffees,
    createGreenCoffee: greenCoffeeResolvers.create,
    updateGreenCoffee: greenCoffeeResolvers.update,

    //RoastedCoffee resolvers
    roastedCoffees: roastedCoffeeResolvers.getRoastedCoffees,
    createRoastedCoffee: roastedCoffeeResolvers.create,
    updateRoastedCoffee: roastedCoffeeResolvers.update,

    //Product resolvers
    assignProductToRoastedCoffee: productResolvers.assignProductToRoastedCoffee,
    products: productResolvers.getProducts,

    //Roasting resolvers
    roastings: roastingResolvers.getRoastingsResolver,
    createRoasting: roastingResolvers.createRoastingResolver,
    selectOrdersRoasting: roastingResolvers.selectOrdersRoastingResolver,
    finishRoasting: roastingResolvers.finishRoastingResolver,
    finishBatch: roastingResolvers.finishBatchResolver,
    reportRealYield: roastingResolvers.reportRealYieldResolver,
    startRoasting: roastingResolvers.startRoastingResolver,
    synchronizeProducts: context.syncService.syncProducts,
  };
};
