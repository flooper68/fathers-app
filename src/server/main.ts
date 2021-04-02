import express from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'

import { ProducModel } from './models/product.'

config()

// var WooCommerceAPI = require("woocommerce-api");

// var WooCommerce = new WooCommerceAPI({
//   url: "https://fatherscoffee.cz",
//   consumerKey: "ck_4a5c540c9f7cc8c714e5e1617c5ccb4e46f21224",
//   consumerSecret: "cs_1f2be67f40a6f8a4a77f0f4dec111630790e8158",
//   wpAPI: true,
//   version: "wc/v1",
// });

// WooCommerce.getAsync("products?per_page=50").then(function (result) {
//   console.log(
//     JSON.parse(result.toJSON().body).map((data) => ({
//       name: data.name,
//       categories: data.categories.map((cat) => cat.name),
//     }))
//   );
// });

const app = express()
const port = 3001

app.get('/api', (req, res) => {
  console.log('test api call success asdg ')
  res.json({ success: true })
})

mongoose
  .connect(
    `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_DATABASE_NAME}?authSource=${process.env.MONGO_DB_AUTHENTICATION_DATABASE_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('db connected')
  })
  .catch((e) => {
    console.log('Error connecting to db', e)
  })

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`)

  const product = new ProducModel({ name: 'test' })
  await product.save()
  console.log('saved', product)
})
