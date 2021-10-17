import { Logger } from './../../shared/logger';
import { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';

import { appSchema } from './schema/schema';
import { buildAppResolver } from './resolvers/app-resolver';
import { CatalogModule } from '../modules/catalog/catalog-contracts';
import {
  GreenCoffeeRepository,
  RoastedCoffeeRepository,
  RoastingProductRepository,
  RoastingModule,
} from '../modules/roasting/roasting-contracts';
import { SalesModule } from '../modules/sales/sales-contracts';
import { SyncService } from '../services/data-sync/data-sync';
import { WarehouseModule } from './../modules/warehouse/warehouse-contracts';
import { WarehouseProjection } from './../projections/warehouse-projection';
import { RoastingProjection } from './../projections/roasting-projection';

export const withGraphqlApi = (context: {
  app: Express;
  syncService: SyncService;
  greenCoffeeRepository: GreenCoffeeRepository;
  roastedCoffeeRepository: RoastedCoffeeRepository;
  roastingProductRepository: RoastingProductRepository;
  roastingModule: RoastingModule;
  catalogModule: CatalogModule;
  salesModule: SalesModule;
  warehouseModule: WarehouseModule;
  roastingProjection: RoastingProjection;
  warehouseProjection: WarehouseProjection;
}) => {
  context.app.use(
    '/api/graphql',
    graphqlHTTP({
      schema: appSchema,
      rootValue: buildAppResolver(context),
      graphiql: true,
      customFormatErrorFn: (error) => {
        Logger.error(`Graphql error`, error);
        return error;
      },
    })
  );
};
