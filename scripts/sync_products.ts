import mongoose from 'mongoose';
import { config } from 'dotenv';

import { reducePromisesInSequence } from './../src/server/services/promise-utils';
import { buildWooCommerceClient } from './../src/server/services/woocommerce-client';
import { Logger } from './../src/shared/logger';
import { fetchVariationsAndMapProducts, syncProduct } from './../src/server/services/data-sync/sync-products';

import {
  WooCommerceProductResponse,
  Product,
} from '../src/shared/types/product';

config();

const start = Date.now();
Logger.info(`Started syncing some data`);

mongoose
  .connect(
    `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_DATABASE_NAME}?authSource=${process.env.MONGO_DB_AUTHENTICATION_DATABASE_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(async () => {
    Logger.info(`Connected to db`);

    const woocommerceClient = await buildWooCommerceClient();

    Logger.info('Syncing products');

    try {
      const result = await woocommerceClient.getAllProducts();

      Logger.info(`Fetched ${result.totalCount} products`);

      const products = await reducePromisesInSequence(
        result.rows,
        (item: WooCommerceProductResponse, productsMemo: Product[]) =>
          fetchVariationsAndMapProducts(item, woocommerceClient, productsMemo)
      );

      Logger.debug('Finished downloading data');

      await Promise.all(products.map(syncProduct));
    } catch (e) {
      Logger.error(`Error syncing products`, e);
    }

    await mongoose.disconnect();
    Logger.info(`Sync finished  ${(Date.now() - start) / 1000} s`);
  })

  .catch((e) => {
    Logger.error('Error connecting to db', e);
  });
