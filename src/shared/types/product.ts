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
  variations: number[]
}

export type WooCommerceProductVariationResponse = {
  id: number
  weight: string
}

export interface Product {
  id: number
  name: string
  dateModified: string
  description: string
  shortDescription: string
  images: { id: number; name: string; src: string }[]
  categories: { id: number; name: string }[]
  variations: {
    id: number
    weight: number
  }[]
  roastedCoffeeId?: number
}
