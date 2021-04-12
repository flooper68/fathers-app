export interface Product {
  id: number
  name: string
  dateModified: string
  slug: string
  description: string
  shortDescription: string
  price: number
  weight: number
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
