import { Logger } from '../../shared/logger'
import { ProductModel } from '../models/product.'
import { WooCommerceClient } from './woocommerce'
import { OrderModel } from '../models/order'
import { Product } from '../../shared/types/product'
import { Order } from '../../shared/types/order'

const ORDER_SYNC_INTERVAL_MS = 300000

export const buildDataSync = (client: WooCommerceClient) => {
  const syncProducts = async () => {
    const start = Date.now()
    Logger.debug('Syncing products')
    const products = await client.getAllProducts()

    Logger.debug(`Fetched ${products.totalCount} products`)

    const enrichedProducts: Product[] = []

    try {
      for (const [index, item] of products.rows.entries()) {
        const variations = await client.getAllProductVariations(item.id)
        Logger.debug(
          `Fetching ${variations.totalCount} product variations for product ${item.name}`
        )

        enrichedProducts.push({
          id: item.id,
          name: item.name,
          dateModified: item.date_modified,
          description: item.description,
          shortDescription: item.short_description,
          images: item.images,
          categories: item.categories.map((category) => {
            return { id: category.id, name: category.name }
          }),
          variations: variations.rows.map((variation) => {
            return {
              id: variation.id,
              weight: isNaN(parseFloat(variation.weight))
                ? null
                : parseFloat(variation.weight),
            }
          }),
        })

        Logger.debug(
          `Completed ${index + 1} of ${products.totalCount} products, ${(
            ((index + 1) / products.totalCount) *
            100
          ).toFixed(2)} %, working for ${Date.now() - start} ms`
        )
      }
    } catch (e) {
      Logger.error(`Error downloading product variations from WooCommerce`, e)
    }

    Logger.debug('Finished downloading data')

    await Promise.all(
      enrichedProducts.map(async (row) => {
        const dbEntity = await ProductModel.findOne({
          id: row.id,
        }).exec()

        if (dbEntity) {
          Logger.debug(`Product ${row.id} exists, updating`)
          await dbEntity.update({ row })
        } else {
          Logger.debug(`Product ${row.id} does not exist, creating new entry`)
          const dbEntity = new ProductModel(row)
          await dbEntity.save()
        }
      })
    )

    const stop = Date.now()
    Logger.debug(`Syncing products finished, took ${stop - start} ms`)
  }

  const syncThisWeekOrders = async () => {
    const start = Date.now()
    Logger.debug('Syncing orders')
    const result = await client.getAllOrdersFromThisWeek()
    const orders: Order[] = result.rows.map((order) => {
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
          }
        }),
        roasted: false,
      }
    })

    Logger.debug(`Fetched ${result.totalCount} orders`)

    Logger.debug('Finished downloading data')

    await Promise.all(
      orders.map(async (order) => {
        const dbEntity = await OrderModel.findOne({
          id: order.id,
        }).exec()

        if (dbEntity) {
          Logger.debug(`Order ${order.id} exists`)

          if (dbEntity.dateModified === order.dateModified) {
            Logger.debug(`Order ${order.id} was modified, updating status`)
            await dbEntity.update({ status: order.status })
          } else {
            Logger.debug(`Order ${order.id} was not modified`)
          }
        } else {
          Logger.debug(`Order ${order.id} does not exist, creating new entry`)
          const dbEntity = new OrderModel(order)
          await dbEntity.save()
        }
      })
    )

    const stop = Date.now()
    Logger.debug(`Syncing orders finished, took ${stop - start} ms`)
  }

  const startOrderSyncJob = () => {
    const sync = async () => {
      await syncThisWeekOrders()

      setTimeout(async () => {
        await syncThisWeekOrders()
      }, ORDER_SYNC_INTERVAL_MS)
    }

    sync()
  }

  return {
    syncProducts,
    syncThisWeekOrders,
    startOrderSyncJob,
  }
}
