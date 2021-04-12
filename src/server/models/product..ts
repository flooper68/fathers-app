import { Schema, model, Model } from 'mongoose'

import { ProductDocument } from './../types/product'

const PRODUCT_SCHEMA_VERSION = 1

const productCategorySchema = new Schema({
  id: { type: Number },
  name: String,
})

const productImageSchema = new Schema({
  id: { type: Number },
  name: String,
  src: String,
})

const productSchema: Schema<ProductDocument> = new Schema({
  id: { type: Number, required: true },
  schemaVersion: {
    type: Number,
    default: PRODUCT_SCHEMA_VERSION,
    required: true,
  },
  name: { type: String, required: true },
  dateModified: { type: Date, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  shortDescription: { type: String },
  price: { type: Number },
  categories: [productCategorySchema],
  images: [productImageSchema],
})

export const ProductModel: Model<ProductDocument> = model<ProductDocument>(
  'Product',
  productSchema
)
