import express from 'express';
import mongoose from 'mongoose';

import { buildRoastingRepository } from './modules/roasting/repositories/roasting-repository';
import { buildCatalogModule } from './modules/catalog/catalog-module';
import { buildRoastingProductRepository } from './modules/roasting/repositories/roasting-product-repository';
import { buildRoastedCoffeeRepository } from './modules/roasting/repositories/roasted-coffee-repository';
import { Logger } from './../shared/logger';
import { buildWooCommerceClient } from './services/woocommerce-client';
import { buildDataSync } from './services/data-sync/data-sync';
import { buildGreenCoffeeRepository } from './modules/roasting/repositories/green-coffee-repository';
import { buildRoastingModule } from './modules/roasting/roasting-module';
import { buildSalesModule } from './modules/sales/sales-module';
import { withGraphqlApi } from './api/with-graphql-api';
import { withStaticRouter } from './static-router';
import { buildWarehouseModule } from './modules/warehouse/warehouse-module';
import { buildWarehouseRoastedCoffeeRepository } from './modules/warehouse/repositories/warehouse-roasted-coffee-repository';
import { buildMessageBroker } from './services/message-broker';
import { buildRoastingProjection } from './projections/roasting-projection';
import { buildWarehouseProjection } from './projections/warehouse-projection';
import { getApplicationContext } from './app-context';

const bootstrap = async () => {
  const context = await getApplicationContext();
  const applicationConfig = context.applicationConfig.getConfig();

  const app = express();

  await mongoose.connect(
    `mongodb://${applicationConfig.dbUsername}:${applicationConfig.dbPassword}@${applicationConfig.dbHost}:${applicationConfig.dbPort}/${applicationConfig.dbName}?authSource=${applicationConfig.authenticationDbName}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  Logger.info('Db connected');

  const messageBroker = buildMessageBroker();

  const woocommerceClient = await buildWooCommerceClient(applicationConfig);
  const syncService = buildDataSync(woocommerceClient);
  const greenCoffeeRepository = buildGreenCoffeeRepository();
  const roastingRepository = buildRoastingRepository();
  const roastedCoffeeRepository = buildRoastedCoffeeRepository();
  const roastingProductRepository = buildRoastingProductRepository();
  const warehouseRoastedCoffeeRepository =
    buildWarehouseRoastedCoffeeRepository({ messageBroker });

  const roastingModule = buildRoastingModule({
    roastedCoffeeRepository,
    roastingProductRepository,
    greenCoffeeRepository,
    roastingRepository,
    messageBroker,
  });
  const catalogModule = buildCatalogModule();
  const salesModule = buildSalesModule();

  const warehouseProjection = buildWarehouseProjection({ messageBroker });
  await warehouseProjection.init();
  const roastingProjection = buildRoastingProjection({
    roastingModule,
    salesModule,
    catalogModule,
  });

  const warehouseModule = buildWarehouseModule({
    warehouseRoastedCoffeeRepository,
    roastingProjection,
    messageBroker,
  });

  withGraphqlApi({
    app,
    syncService,
    greenCoffeeRepository,
    roastedCoffeeRepository,
    roastingProductRepository,
    roastingModule,
    catalogModule,
    salesModule,
    warehouseModule,
    roastingProjection,
    warehouseProjection,
  });

  syncService.startOrderSyncJob();

  withStaticRouter({ app });

  app.listen(applicationConfig.serverPort);

  Logger.info(`Listening on port ${applicationConfig.serverPort}`);
};

bootstrap();
