import { gql } from '@apollo/client';

export const SyncStateQuery = gql`
  query GetSyncState {
    sync {
      lastOrderSyncTime
      orderSyncInProgress
      orderSyncDataVersion
      orderSyncError
      orderSyncErrorMessage
      productSyncInProgress
      productSyncDataVersion
      productSyncError
      productSyncErrorMessage
    }
  }
`;

export interface SyncState {
  lastOrderSyncTime: string;
  orderSyncInProgress: boolean;
  orderSyncDataVersion: number;
  orderSyncError?: boolean;
  orderSyncErrorMessage?: string;
  productSyncInProgress: boolean;
  productSyncDataVersion: number;
  productSyncError?: boolean;
  productSyncErrorMessage?: string;
}
