import { gql } from '@apollo/client';

export const OrdersListQuery = gql`
  query GetOrders($page: Int!) {
    orders(page: $page) {
      page
      pageCount
      rows {
        id
        number
        status
        dateCreated
        roastingId
        roastingDate
        lineItems {
          name
          quantity
          variationId
        }
      }
    }
  }
`;

export interface OrderListItem {
  id: number;
  number: number;
  status: string;
  dateCreated: string;
  roastingId?: string;
  roastingDate?: string;
  lineItems: {
    name: string;
    quantity: number;
    variationId: number;
  }[];
}

export interface OrderListResult {
  page: number;
  pageCount: number;
  rows: OrderListItem[];
}
