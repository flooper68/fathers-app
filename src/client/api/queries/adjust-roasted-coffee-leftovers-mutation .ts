import { gql } from '@apollo/client';

export const AdjustRoastedCoffeeLeftoversMutation = gql`
  mutation AdjustLeftovers($roastedCoffeeId: String!, $newAmount: Float!) {
    adjustRoastedCoffeeLeftovers(
      roastedCoffeeId: $roastedCoffeeId
      newAmount: $newAmount
    ) {
      success
    }
  }
`;
