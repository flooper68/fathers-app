import { gql } from '@apollo/client';

export const ReportRealYieldMutation = gql`
  mutation ReportRealYield($roastedCoffeeId: Int!, $weight: Float!) {
    reportRealYield(roastedCoffeeId: $roastedCoffeeId, weight: $weight) {
      success
    }
  }
`;
