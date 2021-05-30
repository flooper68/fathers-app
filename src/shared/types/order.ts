export type WooCommerceOrderResponse = {
  id: number
  number: string
  date_created: string
  date_modified: string
  status: string
  currency: string
  line_items: {
    id: number
    name: string
    parent_name: string
    product_id: number
    variation_id: number
    quantity: number
    price: number
    total: number
  }[]
}

export interface OrderLineItem {
  id: number
  name: string
  productName: string
  productId: number
  variationId: number
  quantity: number
}

export interface Order {
  id: number
  number: string
  dateCreated: string
  dateModified: string
  roastingId?: string
  roasted: boolean
  status: string
  lineItems: OrderLineItem[]
}
