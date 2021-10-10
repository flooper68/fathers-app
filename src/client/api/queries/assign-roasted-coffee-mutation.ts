import { gql } from '@apollo/client';

export const AssignRoastedCoffeeMutation = gql`
  mutation CreateGreenCoffeeRoasting($id: Int!, $roastedCoffeeId: String!) {
    assignProductToRoastedCoffee(id: $id, roastedCoffeeId: $roastedCoffeeId) {
      success
    }
  }
`;
