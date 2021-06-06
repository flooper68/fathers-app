import mongoose from 'mongoose'
import { config } from 'dotenv'

import {
  mapOrder,
  syncOrder,
} from '../src/server/services/data-sync/sync-orders'
import { buildWooCommerceClient } from '../src/server/services/woocommerce'
import { Logger } from '../src/shared/logger'

config()

const start = Date.now()
Logger.info(`Started syncing all orders`)

mongoose
  .connect(
    `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_DATABASE_NAME}?authSource=${process.env.MONGO_DB_AUTHENTICATION_DATABASE_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(async () => {
    Logger.info(`Connected to db`)

    const woocommerceClient = await buildWooCommerceClient()

    try {
      let page = 1

      let results = await woocommerceClient.getOrders({
        orderby: 'date',
        order: 'asc',
      })

      while (results.rows.length > 0) {
        Logger.info(`Fetched ${results.rows.length} results`)

        const lastOrder = mapOrder(results.rows[results.rows.length - 1])
        await Promise.all(
          results.rows.map(mapOrder).map((order) => syncOrder(order))
        )
        Logger.info(
          `Fetching page ${page}, running for ${(Date.now() - start) / 1000} s`
        )

        page++

        results = await woocommerceClient.getOrders({
          after: lastOrder.dateCreated,
          orderby: 'date',
          order: 'asc',
        })
      }
    } catch (e) {
      Logger.error(`Error syncing orders`, e)
    }

    Logger.info(`No more results, syncing done`)

    await mongoose.disconnect()
    Logger.info(`Sync finished  ${(Date.now() - start) / 1000} s`)
  })

  .catch((e) => {
    Logger.error('Error connecting to db', e)
  })
