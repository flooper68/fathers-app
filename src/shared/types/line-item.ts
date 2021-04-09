export interface LineItemWooCommerceResponse {
  id: number
  name: string
  product_id: number
  quantity: number
  price: number
  total: number
}

export interface LineItem {
  id: number
  order: number
  name: string
  product_id: number
  quantity: number
  price: number
  total: number
}
