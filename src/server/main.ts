import { LineItemModel } from './models/line-item'
import { OrderModel } from './models/order'
import { CategoryModel } from './models/category'
import express from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import { graphqlHTTP } from 'express-graphql'

import { appSchema } from './schema/schema'
import { appResolvers } from './resolvers/resolver'
import { Logger } from './../shared/logger'
import { builWooCommerceClient } from './services/woocommerce'
import { buildDataSync } from './services/data-sync'

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

      const woocommerceClient = await builWooCommerceClient()
      const dataSync = buildDataSync(woocommerceClient)

      // const result = await woocommerceClient.getProducts(1)
      // const result = await woocommerceClient.getAllProducts()
      // const result = await woocommerceClient.getProduct(12379)
      // const result = await woocommerceClient.getOrder(12437)
      // // const result = await woocommerceClient.getOrders(1)
      // // const result = await woocommerceClient.getCategory(276)
      // // const result = await woocommerceClient.getAllCategories()

      // const today = moment()
      // const from_date = today.startOf('week')

      // Logger.debug(from_date.toISOString())

      // const result = await woocommerceClient.getAllOrdersAfterDate(
      //   from_date.toISOString()
      // )

      // const result = await woocommerceClient.getAllOrdersFromThisWeek()

      // await dataSync.syncCategories()
      // await dataSync.syncProducts()
      // await dataSync.syncThisWeekOrders()

      // const result = await LineItemModel.findOne().populate("order_item");
      const result = await OrderModel.findOne().populate('items')
      Logger.debug(result)
    })
  })

  .catch((e) => {
    Logger.error('Error connecting to db', e)
  })
