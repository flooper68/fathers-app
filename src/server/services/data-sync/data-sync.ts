import { Logger } from './../../../shared/logger'
import { RoastingService } from '../roasting-service'
import { buildSyncNewOrders, buildSyncUnresolvedOrders } from './sync-orders'
import { buildSyncProducts } from './sync-products'
import { WooCommerceClient } from '../woocommerce'

const ORDER_SYNC_INTERVAL_MS = 30000

export const buildDataSync = (
  client: WooCommerceClient,
  roastingService: RoastingService
) => {
  let syncState: {
    lastOrderSyncTime: string
    orderSyncInProgress: boolean
    orderSyncDataVersion: number
    orderSyncErrorMessage?: string
    orderSyncError?: boolean
    productSyncInProgress: boolean
    productSyncDataVersion: number
    productSyncError?: boolean
    productSyncErrorMessage?: string
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
  }

  const setProductSyncState = (state: {
    productSyncInProgress: boolean
    productSyncError?: boolean
    productSyncErrorMessage?: string
  }) => {
    syncState = {
      ...syncState,
      ...state,
      productSyncDataVersion: state.productSyncError
        ? syncState.productSyncDataVersion
        : syncState.productSyncDataVersion + 1,
    }
  }

  const syncNewOrders = buildSyncNewOrders(client, roastingService)
  const syncUnresolvedOrders = buildSyncUnresolvedOrders(
    client,
    roastingService
  )

  const startOrderSyncJob = () => {
    Logger.debug(
      `Starting Order Sync Job, sync interval is ${
        ORDER_SYNC_INTERVAL_MS / 1000
      } s`
    )

    const sync = async () => {
      syncState.orderSyncInProgress = true

      try {
        const newOrdersAdded = await syncNewOrders()
        const updatedOrdersAdded = await syncUnresolvedOrders()

        if (newOrdersAdded + updatedOrdersAdded > 1) {
          Logger.debug(
            `${
              newOrdersAdded + updatedOrdersAdded
            } orders were processed for roasting, updating order data version`
          )
          syncState.orderSyncDataVersion++
        } else {
          Logger.debug(`There were no changes in roasting`)
        }
      } catch (e) {
        syncState.orderSyncErrorMessage = e.message
        syncState.orderSyncError = true
        Logger.error(`Error syncing orders`, e)
      }

      syncState.lastOrderSyncTime = new Date().toISOString()
      syncState.orderSyncInProgress = false

      setTimeout(async () => {
        sync()
      }, ORDER_SYNC_INTERVAL_MS)
    }

    sync()
  }

  return {
    syncProducts: () => {
      buildSyncProducts(client, setProductSyncState)()
    },
    syncNewOrders,
    syncUnresolvedOrders,
    startOrderSyncJob,
    getSyncState: () => {
      return { ...syncState }
    },
  }
}

export type SyncService = ReturnType<typeof buildDataSync>
