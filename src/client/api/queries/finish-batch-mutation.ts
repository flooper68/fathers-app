import { gql } from '@apollo/client';

export const FinishBatchMutation = gql`
  mutation FinishBatch($roastedCoffeeId: String!) {
    finishBatch(roastedCoffeeId: $roastedCoffeeId) {
      success
    }
  }
`;
