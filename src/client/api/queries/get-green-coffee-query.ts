import { gql } from '@apollo/client';

export const GreenCoffeeQuery = gql`
  query GetGreenCoffee {
    greenCoffees {
      id
      name
      batchWeight
      roastingLossFactor
    }
  }
`;

export interface GreenCoffeeListItem {
  id: string;
  name: string;
  batchWeight: number;
  roastingLossFactor: number;
}
