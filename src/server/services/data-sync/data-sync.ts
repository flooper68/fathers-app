import { Logger } from '../../../shared/logger';
import { buildSyncNewOrders, buildSyncUnresolvedOrders } from './sync-orders';
import { buildSyncProducts } from './sync-products';
import { WooCommerceClient } from '../woocommerce-client';

const ORDER_SYNC_INTERVAL_MS = 30000;

export const buildDataSync = (client: WooCommerceClient) => {
  let syncState: {
    lastOrderSyncTime: string;
    orderSyncInProgress: boolean;
    orderSyncDataVersion: number;
    orderSyncErrorMessage?: string;
    orderSyncError?: boolean;
    productSyncInProgress: boolean;
    productSyncDataVersion: number;
    productSyncError?: boolean;
    productSyncErrorMessage?: string;
  } = {
    lastOrderSyncTime: new Date().toISOString(),
    orderSyncInProgress: false,
    orderSyncDataVersion: 0,
    orderSyncErrorMessage: undefined,
    orderSyncError: undefined,
    productSyncInProgress: false,
    productSyncDataVersion: 0,
    productSyncError: undefined,
    productSyncErrorMessage: undefined,
  };

  const setProductSyncState = (state: {
    productSyncInProgress: boolean;
    productSyncError?: boolean;
    productSyncErrorMessage?: string;
  }) => {
    syncState = {
      ...syncState,
      ...state,
      productSyncDataVersion: state.productSyncError
        ? syncState.productSyncDataVersion
        : syncState.productSyncDataVersion + 1,
    };
  };

  const syncNewOrders = buildSyncNewOrders(client);
  const syncUnresolvedOrders = buildSyncUnresolvedOrders(client);

  const startOrderSyncJob = () => {
    Logger.debug(
      `Starting Order Sync Job, sync interval is ${
        ORDER_SYNC_INTERVAL_MS / 1000
      } s`
    );

    const sync = async () => {
      syncState.orderSyncInProgress = true;

      try {
        await syncNewOrders();
        await syncUnresolvedOrders();
      } catch (e) {
        syncState.orderSyncErrorMessage = e.message;
        syncState.orderSyncError = true;
        Logger.error(`Error syncing orders`, e);
      }

      syncState.lastOrderSyncTime = new Date().toISOString();
      syncState.orderSyncInProgress = false;

      setTimeout(async () => {
        sync();
      }, ORDER_SYNC_INTERVAL_MS);
    };

    sync();
  };

  return {
    syncProducts: () => {
      buildSyncProducts(client, setProductSyncState)();
    },
    syncNewOrders,
    syncUnresolvedOrders,
    startOrderSyncJob,
    getSyncState: () => {
      return { ...syncState };
    },
  };
};

export type SyncService = ReturnType<typeof buildDataSync>;
