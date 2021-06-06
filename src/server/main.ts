import express from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import { graphqlHTTP } from 'express-graphql'

import { Logger } from './../shared/logger'
import { buildWooCommerceClient } from './services/woocommerce'
import { buildDataSync } from './services/data-sync/data-sync'
import { appSchema } from './api/schema/schema'
import { buildAppResolver } from './api/resolvers/resolver'
import { buildRoastingService } from './services/roasting-service'

config()

const app = express()

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

      const roastingService = buildRoastingService()
      const woocommerceClient = await buildWooCommerceClient()
      const syncService = buildDataSync(woocommerceClient, roastingService)

      app.use(
        '/api/graphql',
        graphqlHTTP({
          schema: appSchema,
          rootValue: buildAppResolver(syncService, roastingService),
          graphiql: true,
        })
      )

      // await syncService.syncProducts()
      await syncService.startOrderSyncJob()
    })
  })

  .catch((e) => {
    Logger.error('Error connecting to db', e)
  })
