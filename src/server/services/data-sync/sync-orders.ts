import { Logger } from '../../../shared/logger';
import { WooCommerceOrderResponse, Order } from '../../../shared/types/order';
import { OrderModel } from '../../modules/sales/repository/order-model';
import { runPromisesInSequence } from '../promise-utils';
import { WooCommerceClient } from '../woocommerce-client';

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

export const buildSyncNewOrders = (client: WooCommerceClient) => async () => {
  const start = Date.now();
  Logger.info('Syncing new orders');

  const result = await client.getNewOrders();
  const orders: Order[] = result.rows.map(mapOrder);

  Logger.info(`Fetched ${result.totalCount} orders`);

  const handleNewOrder = async (order: Order) => {
    await syncOrder(order);
  };

  await runPromisesInSequence(orders, handleNewOrder);

  const stop = Date.now();
  Logger.info(`Syncing orders finished, took ${stop - start} ms`);
};

export const buildSyncUnresolvedOrders = (
  client: WooCommerceClient
) => async () => {
  const start = Date.now();
  Logger.info('Syncing unresolved orders');

  const result = await client.getUnresolvedOrders();
  const orders: Order[] = result.rows.map(mapOrder);

  Logger.info(`Fetched ${result.totalCount} orders`);

  const handleOrder = async (order: Order) => {
    await syncOrder(order);
  };

  await runPromisesInSequence(orders, handleOrder);

  const stop = Date.now();
  Logger.info(`Syncing orders finished, took ${stop - start} ms`);
};
