import { gql } from '@apollo/client';

export const SynchronizeProductsMutation = gql`
  mutation SynchronizeProducts {
    synchronizeProducts
  }
`;
