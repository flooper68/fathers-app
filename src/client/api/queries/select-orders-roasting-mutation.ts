import { gql } from '@apollo/client';

export const SelectOrdersRoastingMutation = gql`
  mutation SelectOrdersRoasting($roastingId: String!, $orderId: Int!) {
    selectOrdersRoasting(roastingId: $roastingId, orderId: $orderId) {
      success
    }
  }
`;
