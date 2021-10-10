import { gql } from '@apollo/client';

export const UpdateGreenCoffeeMutation = gql`
  mutation UpdateGreenCoffeeRoasting(
    $id: String!
    $name: String!
    $batchWeight: Float!
    $roastingLossFactor: Float!
  ) {
    updateGreenCoffee(
      id: $id
      name: $name
      batchWeight: $batchWeight
      roastingLossFactor: $roastingLossFactor
    ) {
      success
    }
  }
`;
