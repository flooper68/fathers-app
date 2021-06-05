import { Logger } from '../../../shared/logger'
import { buildSyncNewOrders, buildSyncUnresolvedOrders } from './sync-orders'
import { buildSyncProducts } from './sync-products'
import { WooCommerceClient } from '../woocommerce'

const ORDER_SYNC_INTERVAL_MS = 300000

export const buildDataSync = (client: WooCommerceClient) => {
  const syncNewOrders = buildSyncNewOrders(client)
  const syncUnresolvedOrders = buildSyncUnresolvedOrders(client)

  const startOrderSyncJob = () => {
    Logger.debug(
      `Starting Order Sync Job, sync interval is ${
        ORDER_SYNC_INTERVAL_MS / 1000
      } s`
    )

    const sync = async () => {
      await syncNewOrders()
      await syncUnresolvedOrders()

      setTimeout(async () => {
        await syncNewOrders()
        await syncUnresolvedOrders()
      }, ORDER_SYNC_INTERVAL_MS)
    }

    sync()
  }

  return {
    syncProducts: buildSyncProducts(client),
    syncNewOrders,
    syncUnresolvedOrders,
    startOrderSyncJob,
  }
}
