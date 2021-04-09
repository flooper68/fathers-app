import { LineItem, LineItemWooCommerceResponse } from './line-item'

export type WooCommerceOrderResponse = {
  id: number
  number: string
  date_created: string
  date_modified: string
  status: string
  currency: string
  line_items: LineItemWooCommerceResponse[]
}

export interface Order {
  id: number
  number: string
  date_created: string
  date_modified: string
  status: string
  currency: string
  line_items: LineItem[]
}
