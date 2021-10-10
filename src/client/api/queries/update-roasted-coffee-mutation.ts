import { gql } from '@apollo/client';

export const UpdateRoastedCoffeeMutation = gql`
  mutation UpdateRoastedCoffee(
    $id: String!
    $name: String!
    $greenCoffeeId: String!
  ) {
    updateRoastedCoffee(id: $id, name: $name, greenCoffeeId: $greenCoffeeId) {
      success
    }
  }
`;
