import { LineItemModel } from './../models/line-item'
import { OrderModel } from './../models/order'
import { CategoryModel } from './../models/category'
import { Model } from 'mongoose'

import { Logger } from '../../shared/logger'
import { ProductModel } from '../models/product.'
import { WooCommerceClient } from './woocommerce'
import { Order } from '../../shared/types/order'

const isSameDateString = (dateOne: string, dateTwo: string) => {
  return new Date(dateOne).getTime() === new Date(dateTwo).getTime()
}

const mapToMongoId = <Entity extends { id: number }>(item: Entity) => {
  return { ...item, _id: item.id }
}

const buildSyncEntityWithModifiedCheck = <
  Entity extends { id: number; date_modified: string }
>(
  client: WooCommerceClient,
  clientCallExtractor: (
    client: WooCommerceClient
  ) => () => Promise<{ rows: Entity[]; totalCount: string }>,
  model: Model<any>
) => async () => {
  Logger.debug('Syncing entity')
  const { rows, totalCount } = await clientCallExtractor(client)()
  Logger.debug(`WooCommerce entity fetched. ${totalCount} entities present.`)

  await Promise.all(
    rows.map(async (row) => {
      const dbProduct = await model
        .findOne({
          id: row.id,
        })
        .exec()

      if (
        dbProduct &&
        isSameDateString(dbProduct.date_modified, row.date_modified)
      ) {
        Logger.debug(`Entity ${row.id} exists and was not modified.`)
        return
      } else if (dbProduct) {
        Logger.debug(`Entity ${row.id} exists and was modified, updating.`)
        await dbProduct.update({ row })
      } else {
        Logger.debug(`Entity ${row.id} does not exist, creating new entry.`)
        const { line_items, ...data } = (row as unknown) as Order
        const product = new model(mapToMongoId(data))
        await product.save()
        await Promise.all(
          line_items.map(async (item) => {
            const lineItem = new LineItemModel(mapToMongoId(item))
            await lineItem.save()
          })
        )
      }
    })
  )
  Logger.debug('Syncing entities finished')
}

const buildSyncEntity = <Entity extends { id: number }>(
  client: WooCommerceClient,
  clientCallExtractor: (
    client: WooCommerceClient
  ) => () => Promise<{ rows: Entity[]; totalCount: string }>,
  model: Model<any>
) => async () => {
  Logger.debug('Syncing entity')
  const { rows, totalCount } = await clientCallExtractor(client)()
  Logger.debug(`WooCommerce entity fetched. ${totalCount} entities present.`)

  await Promise.all(
    rows.map(async (row) => {
      const dbProduct = await model.findById(row.id).exec()

      if (dbProduct) {
        Logger.debug(`Entity ${row.id} exists, updating.`)
        await dbProduct.update({ row })
      } else {
        Logger.debug(`Entity ${row.id} does not exist, creating new entry.`)
        const product = new model(mapToMongoId(row))
        await product.save()
      }
    })
  )
  Logger.debug('Syncing entities finished')
}

export const buildDataSync = (client: WooCommerceClient) => {
  return {
    syncProducts: buildSyncEntityWithModifiedCheck(
      client,
      (client: WooCommerceClient) => client.getAllProducts,
      ProductModel
    ),
    syncThisWeekOrders: buildSyncEntityWithModifiedCheck(
      client,
      (client: WooCommerceClient) => client.getAllOrdersFromThisWeek,
      OrderModel
    ),
    syncCategories: buildSyncEntity(
      client,
      (client: WooCommerceClient) => client.getAllCategories,
      CategoryModel
    ),
  }
}
