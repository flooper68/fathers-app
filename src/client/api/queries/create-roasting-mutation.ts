import { gql } from '@apollo/client';

export const CreateRoastingMutation = gql`
  mutation CreateRoasting($date: String!) {
    createRoasting(date: $date) {
      success
    }
  }
`;
