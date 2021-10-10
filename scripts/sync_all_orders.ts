import mongoose from 'mongoose';
import { config } from 'dotenv';

import { Logger } from '../src/shared/logger';
import { OrderModel } from '../src/server/modules/sales/repository/order-model';
import { buildWooCommerceClient } from '../src/server/services/woocommerce-client';
import { WooCommerceOrderResponse, Order } from '../src/shared/types/order';

config();

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

const start = Date.now();
Logger.info(`Started syncing all orders`);

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

    try {
      let page = 1;

      let results = await woocommerceClient.getOrders({
        orderby: 'date',
        order: 'asc',
      });

      while (results.rows.length > 0) {
        Logger.info(`Fetched ${results.rows.length} results`);

        const lastOrder = mapOrder(results.rows[results.rows.length - 1]);
        await Promise.all(
          results.rows.map(mapOrder).map((order) => syncOrder(order))
        );
        Logger.info(
          `Fetching page ${page}, running for ${(Date.now() - start) / 1000} s`
        );

        page++;

        results = await woocommerceClient.getOrders({
          after: lastOrder.dateCreated,
          orderby: 'date',
          order: 'asc',
        });
      }
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
