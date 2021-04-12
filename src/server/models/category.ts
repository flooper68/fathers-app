import moongose, { Schema } from 'mongoose'

import { CategoryDocument } from './../types/category'

const CATEGORY_SCHEMA_VERSION = 1

const categorySchema = new Schema({
  id: { type: Number, required: true },
  schemaVersion: {
    type: Number,
    default: CATEGORY_SCHEMA_VERSION,
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String },
})

export const CategoryModel = moongose.model<CategoryDocument>(
  'Category',
  categorySchema
)
