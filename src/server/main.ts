import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';

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

config();

const app = express();

mongoose
  .connect(
    `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_DATABASE_NAME}?authSource=${process.env.MONGO_DB_AUTHENTICATION_DATABASE_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    Logger.info('Db connected');
    app.listen(process.env.SERVER_PORT, async () => {
      Logger.info(`App listening at port ${process.env.SERVER_PORT}`);

      const woocommerceClient = await buildWooCommerceClient();
      const syncService = buildDataSync(woocommerceClient);
      const greenCoffeeRepository = buildGreenCoffeeRepository();
      const roastingRepository = buildRoastingRepository();
      const roastedCoffeeRepository = buildRoastedCoffeeRepository();
      const roastingProductRepository = buildRoastingProductRepository();

      const roastingModule = buildRoastingModule({
        roastedCoffeeRepository,
        roastingProductRepository,
        greenCoffeeRepository,
        roastingRepository,
      });

      const catalogModule = buildCatalogModule();
      const salesModule = buildSalesModule();

      withGraphqlApi({
        app,
        syncService,
        greenCoffeeRepository,
        roastedCoffeeRepository,
        roastingProductRepository,
        roastingModule,
        catalogModule,
        salesModule,
      });

      await syncService.startOrderSyncJob();
    });
  })

  .catch((e) => {
    Logger.error('Error connecting to db', e);
  });
