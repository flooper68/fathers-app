export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  ON_HOLD = 'on-hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  FAILED = 'failed ',
  TRASH = 'trash ',
}

export type WooCommerceOrderResponse = {
  id: number;
  number: string;
  date_created: string;
  date_modified: string;
  status: OrderStatus;
  currency: string;
  line_items: {
    id: number;
    name: string;
    parent_name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    price: number;
    total: number;
  }[];
};

export interface OrderLineItem {
  id: number;
  name: string;
  productName: string;
  productId: number;
  variationId: number;
  quantity: number;
}

export interface Order {
  id: number;
  number: string;
  dateCreated: string;
  dateModified: string;
  status: OrderStatus;
  lineItems: OrderLineItem[];
}
