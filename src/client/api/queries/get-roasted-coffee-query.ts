import { gql } from '@apollo/client';

export const RoastedCoffeeQuery = gql`
  query GetRoastedCoffee {
    roastedCoffees {
      id
      name
      greenCoffeeId
      greenCoffeeName
    }
  }
`;

export interface RoastedCoffeeListItem {
  id: string;
  name: string;
  greenCoffeeId: string;
  greenCoffeeName: string;
}
