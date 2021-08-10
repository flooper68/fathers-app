import { gql } from '@apollo/client';

export const FinishBatchMutation = gql`
  mutation FinishBatch($roastedCoffeeId: Int!) {
    finishBatch(roastedCoffeeId: $roastedCoffeeId) {
      success
    }
  }
`;
