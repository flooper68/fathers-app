import moongose, { Schema } from 'mongoose'

const productSchema = new Schema({
  _id: { type: Number },
  name: { type: String, required: true },
  date_modified: { type: Date, required: true },
})

export const ProductModel = moongose.model('Product', productSchema)
