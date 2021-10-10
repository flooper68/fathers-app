import { gql } from '@apollo/client';

export const CreateGreenCoffeeMutation = gql`
  mutation CreateGreenCoffeeRoasting(
    $name: String!
    $batchWeight: Float!
    $roastingLossFactor: Float!
  ) {
    createGreenCoffee(
      name: $name
      batchWeight: $batchWeight
      roastingLossFactor: $roastingLossFactor
    ) {
      success
    }
  }
`;
