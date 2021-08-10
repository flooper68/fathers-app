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
        lineItems {
          name
          quantity
          variationId
          product {
            categories {
              name
            }
            variations {
              id
              weight
            }
          }
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
  roastingId: string;
  lineItems: {
    name: string;
    quantity: number;
    variationId: number;
    product: {
      categories: {
        name: string;
      }[];
      variations: {
        id: number;
        weight: number;
      }[];
    };
  }[];
}

export interface OrderListResult {
  page: number;
  pageCount: number;
  rows: OrderListItem[];
}
