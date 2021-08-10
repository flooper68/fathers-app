import { gql } from '@apollo/client';

export const FinishRoastingMutation = gql`
  mutation FinishRoasting {
    finishRoasting {
      success
    }
  }
`;
