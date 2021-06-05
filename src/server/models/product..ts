import { Schema, model } from 'mongoose'

import { Product } from '../../shared/types/product'
import { DocumentWithSchemaVersion } from './../types/general'

const PRODUCT_SCHEMA_VERSION = 1

export interface ProductDocument
  extends Omit<Product, 'id'>,
    DocumentWithSchemaVersion {}

const productSchema = new Schema<ProductDocument>({
  id: { type: Number, required: true },
  schemaVersion: {
    type: Number,
    default: PRODUCT_SCHEMA_VERSION,
    required: true,
  },
  name: { type: String, required: true },
  dateModified: { type: Date, required: true },
  description: { type: String },
  shortDescription: { type: String },
  images: [
    new Schema({
      id: { type: Number, required: true },
      name: { type: String },
      src: { type: String },
    }),
  ],
  variations: [
    new Schema({
      id: { type: Number, required: true },
      weight: { type: Number },
    }),
  ],
  categories: [
    new Schema({
      id: { type: Number, required: true },
      name: { type: String },
    }),
  ],
  roastedCoffeeId: { type: Number },
})

export const ProductModel = model<ProductDocument>('Product', productSchema)
