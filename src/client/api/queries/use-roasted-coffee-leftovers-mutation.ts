import { gql } from '@apollo/client';

export const UseRoastedCoffeeLeftoversMutation = gql`
  mutation UseLeftovers($roastedCoffeeId: String!, $amount: Float!) {
    useRoastedCoffeeLeftovers(
      roastedCoffeeId: $roastedCoffeeId
      amount: $amount
    ) {
      success
    }
  }
`;
