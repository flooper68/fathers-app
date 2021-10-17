import { gql } from '@apollo/client';

export const WarehouseRoastedCoffeeListQuery = gql`
  query GetWarehouseRoastedCoffee {
    warehouseRoastedCoffees {
      roastedCoffeeId
      roastedCoffeeName
      lastUpdated
      quantityOnHand
      lastUpdateReason
      history {
        type
        timestamp
        amount
      }
    }
  }
`;

export interface WarehouseRoastedCoffeeListItem {
  roastedCoffeeId: string;
  roastedCoffeeName: string;
  quantityOnHand: number;
  lastUpdated?: string;
  lastUpdateReason?: string;
  history: {
    type: string;
    timestamp: string;
    amount: number;
  }[];
}
