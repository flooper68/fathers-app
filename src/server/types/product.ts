import { Product } from './../../shared/types/product'
import { DocumentWithSchemaVersion } from './general'

export type WooCommerceProductResponse = {
  id: number
  name: string
  slug: string
  date_modified: string
  description: string
  short_description: string
  price: string
  weight: string
  categories: {
    id: number
    name: string
  }[]
  images: {
    id: number
    src: string
    name: string
  }[]
}

export interface ProductDocument extends DocumentWithSchemaVersion, Product {}
