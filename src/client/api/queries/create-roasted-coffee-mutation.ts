import { gql } from '@apollo/client';

export const CreateRoastedCoffeeMutation = gql`
  mutation CreateRoastedCoffeeRoasting(
    $name: String!
    $greenCoffeeId: String!
  ) {
    createRoastedCoffee(name: $name, greenCoffeeId: $greenCoffeeId) {
      success
    }
  }
`;
