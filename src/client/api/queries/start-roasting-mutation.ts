import { gql } from '@apollo/client';

export const StartRoastingMutation = gql`
  mutation StartRoasting {
    startRoasting {
      success
    }
  }
`;
