import mongoose from 'mongoose';
import moment from 'moment';

import { Logger } from '../src/shared/logger';
import { buildWooCommerceClient } from '../src/server/services/woocommerce-client';
import { OrderModel } from '../src/server/modules/sales/repository/order-model';
import { WooCommerceOrderResponse, Order } from '../src/shared/types/order';
import { getApplicationConfig } from './../src/server/application-config';

const applicationConfig = getApplicationConfig();

const start = Date.now();
Logger.info(`Started syncing some data`);

const mapOrder = (order: WooCommerceOrderResponse): Order => {
  return {
    id: order.id,
    number: order.number,
    dateCreated: order.date_created,
    dateModified: order.date_modified,
    status: order.status,
    lineItems: order.line_items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        productName: item.parent_name,
        productId: item.product_id,
        variationId: item.variation_id,
        quantity: item.quantity,
      };
    }),
  };
};

const syncOrder = async (order: Order) => {
  const dbEntity = await OrderModel.findOne({
    id: order.id,
  }).exec();

  if (dbEntity) {
    Logger.debug(`Order ${order.id} exists`);

    if (dbEntity.dateModified !== order.dateModified) {
      Logger.info(`Order ${order.id} was modified, updating`);
      await dbEntity.updateOne(order);
      return;
    } else {
      Logger.debug(`Order ${order.id} was not modified`);
      return;
    }
  } else {
    Logger.info(`Order ${order.id} does not exist, creating new entry`);
    const dbEntity = new OrderModel(order);
    await dbEntity.save();
  }
};

mongoose
  .connect(
    `mongodb://${applicationConfig.dbUsername}:${applicationConfig.dbPassword}@${applicationConfig.dbHost}:${applicationConfig.dbPort}/${applicationConfig.dbName}?authSource=${applicationConfig.authenticationDbName}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(async () => {
    Logger.info(`Connected to db`);

    const woocommerceClient = await buildWooCommerceClient();

    try {
      const results = await woocommerceClient.getOrders({
        before: moment().subtract(1, 'days').toISOString(),
      });

      Logger.info(`Fetched ${results.rows.length} results`);

      await Promise.all(
        results.rows.map(mapOrder).map((order) => syncOrder(order))
      );
    } catch (e) {
      Logger.error(`Error syncing orders`, e);
    }

    Logger.info(`No more results, syncing done`);

    await mongoose.disconnect();
    Logger.info(`Sync finished  ${(Date.now() - start) / 1000} s`);
  })

  .catch((e) => {
    Logger.error('Error connecting to db', e);
  });
