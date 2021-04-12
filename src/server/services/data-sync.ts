import { CategoryModel } from './../models/category'
import { Model } from 'mongoose'

import { Logger } from '../../shared/logger'
import { ProductModel } from '../models/product.'
import { WooCommerceClient } from './woocommerce'

const isSameDateString = (dateOne: string, dateTwo: string) => {
  return new Date(dateOne).getTime() === new Date(dateTwo).getTime()
}

const mapToMongoId = <Entity extends { id: number }>(item: Entity) => {
  return { ...item, _id: item.id }
}

const buildSyncEntityWithModifiedCheck = <
  Entity extends { id: number; dateModified: string }
>(
  client: WooCommerceClient,
  clientCallExtractor: (
    client: WooCommerceClient
  ) => () => Promise<{ rows: Entity[]; totalCount: string }>,
  // Can not be solved by generics due to @types/mongoose typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>
) => async () => {
  Logger.debug('Syncing entity')
  const { rows, totalCount } = await clientCallExtractor(client)()
  Logger.debug(`WooCommerce entity fetched. ${totalCount} entities present.`)

  await Promise.all(
    rows.map(async (row) => {
      const dbEntity = await model
        .findOne({
          id: row.id,
        })
        .exec()

      if (
        dbEntity &&
        isSameDateString(dbEntity.dateModified, row.dateModified)
      ) {
        Logger.debug(`Entity ${row.id} exists and was not modified.`)
        return
      } else if (dbEntity) {
        Logger.debug(`Entity ${row.id} exists and was modified, updating.`, row)
        await dbEntity.update({ ...row })
      } else {
        Logger.debug(
          `Entity ${row.id} does not exist, creating new entry.`,
          row
        )
        const entity = new model(row)
        await entity.save()
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
  // Can not be solved by generics due to @types/mongoose typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>
) => async () => {
  Logger.debug('Syncing entity')
  const { rows, totalCount } = await clientCallExtractor(client)()
  Logger.debug(`WooCommerce entity fetched. ${totalCount} entities present.`)

  await Promise.all(
    rows.map(async (row) => {
      const dbEntity = await model
        .findOne({
          id: row.id,
        })
        .exec()

      if (dbEntity) {
        Logger.debug(`Entity ${row.id} exists, updating.`)
        await dbEntity.update({ row })
      } else {
        Logger.debug(`Entity ${row.id} does not exist, creating new entry.`)
        const dbEntity = new model(row)
        await dbEntity.save()
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
    // syncThisWeekOrders: buildSyncEntityWithModifiedCheck(
    //   client,
    //   (client: WooCommerceClient) => client.getAllOrdersFromThisWeek,
    //   OrderModel
    // ),
    syncCategories: buildSyncEntity(
      client,
      (client: WooCommerceClient) => client.getAllCategories,
      CategoryModel
    ),
  }
}
