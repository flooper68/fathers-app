import { OrderModel } from './models/order'
import express from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import { graphqlHTTP } from 'express-graphql'

import { Logger } from './../shared/logger'
import { buildWooCommerceClient } from './services/woocommerce'
import { buildDataSync } from './services/data-sync'
import { appSchema } from './api/schema/schema'
import { appResolvers } from './api/resolvers/resolver'
import {
  getNextPlannedRoasting,
  processOrdersToBatches,
} from './domain/roasting'

config()

const app = express()

app.use(
  '/api/graphql',
  graphqlHTTP({
    schema: appSchema,
    rootValue: appResolvers,
    graphiql: true,
  })
)

mongoose
  .connect(
    `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_DATABASE_NAME}?authSource=${process.env.MONGO_DB_AUTHENTICATION_DATABASE_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    Logger.info('Db connected')
    app.listen(process.env.SERVER_PORT, async () => {
      Logger.info(`App listening at port ${process.env.SERVER_PORT}`)

      const woocommerceClient = await buildWooCommerceClient()
      const dataSync = buildDataSync(woocommerceClient)
      await dataSync.syncProducts()
      await dataSync.startOrderSyncJob()

      const orders = await OrderModel.find()

      const roasting = await processOrdersToBatches(orders)

      const plannedRoasting = await getNextPlannedRoasting()
      await plannedRoasting.updateOne(roasting)
      Logger.debug(plannedRoasting)
    })
  })

  .catch((e) => {
    Logger.error('Error connecting to db', e)
  })
