import moongose, { Schema } from 'mongoose'

const categorySchema = new Schema({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String },
})

export const CategoryModel = moongose.model('Category', categorySchema)
