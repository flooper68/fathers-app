import { gql } from '@apollo/client';

import { RoastingStatus } from '../../../shared/types/roasting';
import { OrderListItem } from './get-orders-query';

export const RoastingListQuery = gql`
  query GetRoastings {
    roastings {
      id
      status
      roastingDate
      realYield {
        weight
        roastedCoffeeId
      }
      finishedBatches {
        amount
        roastedCoffeeId
      }
      greenCoffee {
        id
        name
        batchWeight
        roastingLossFactor
        weight
      }
      roastedCoffee {
        id
        name
        numberOfBatches
        finishedBatches
        weight
        realYield
        expectedBatchYield
      }
      orders {
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

export interface RoastingListItem {
  id: number;
  status: RoastingStatus;
  roastingDate: string;
  greenCoffee: {
    id: number;
    name: string;
    batchWeight: number;
    roastingLossFactor: number;
    weight: number;
  }[];
  roastedCoffee: {
    id: number;
    name: string;
    numberOfBatches: number;
    finishedBatches: number;
    weight: number;
    realYield: number;
    expectedBatchYield: number;
  }[];
  orders: OrderListItem[];
  finishedBatches: { amount: number; roastedCoffeeId: number }[];
  realYield: { weight: number; roastedCoffeeId: number }[];
}
