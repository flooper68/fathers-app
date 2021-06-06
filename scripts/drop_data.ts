import mongoose from 'mongoose'
import { config } from 'dotenv'

import { ProductModel } from './../src/server/models/product.'
import { RoastingModel } from './../src/server/models/roasting'
import { OrderModel } from './../src/server/models/order'
import { Logger } from '../src/shared/logger'

config()

const start = Date.now()
Logger.info(`Dropping all collections`)

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

    await OrderModel.collection.drop()
    Logger.info(`Orders dropped`)
    await RoastingModel.collection.drop()
    Logger.info(`Roastings dropped`)
    await ProductModel.collection.drop()
    Logger.info(`Products dropped`)

    await mongoose.disconnect()
    Logger.info(`Drop finished  ${(Date.now() - start) / 1000} s`)
  })

  .catch((e) => {
    Logger.error('Error connecting to db', e)
  })
