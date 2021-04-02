import moongose, { Schema } from 'mongoose'

const productSchema = new Schema({
  name: { type: String, required: true },
})

export const ProducModel = moongose.model('Product', productSchema)
