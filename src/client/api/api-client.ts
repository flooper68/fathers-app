import { ReportRealYieldMutation } from './queries/report-real-yield-mutation';
import { FinishBatchMutation } from './queries/finish-batch-mutation';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import React, { useCallback, useContext } from 'react';

import { SuccessResult } from './api-types';
import { CreateRoastingMutation } from './queries/create-roasting-mutation';
import { FinishRoastingMutation } from './queries/finish-roasting-mutation';
import { OrderListResult, OrdersListQuery } from './queries/get-orders-query';
import {
  ProductListItem,
  ProductListQuery,
} from './queries/get-products-query';
import {
  RoastingListItem,
  RoastingListQuery,
} from './queries/get-roastings-query';
import { SelectOrdersRoastingMutation } from './queries/select-orders-roasting-mutation';
import { StartRoastingMutation } from './queries/start-roasting-mutation';
import { SyncState, SyncStateQuery } from './queries/sync-state-query';
import { SynchronizeProductsMutation } from './queries/synchronize-products-mutation';

export const useBuildApiClient = (
  client: ApolloClient<NormalizedCacheObject>
) => {
  const getProducts = useCallback(() => {
    return client.query<{
      products: ProductListItem[];
    }>({
      query: ProductListQuery,
    });
  }, [client]);

  const getOrders = useCallback(
    (page: number) => {
      return client.query<{
        orders: OrderListResult;
      }>({
        query: OrdersListQuery,
        variables: { page },
      });
    },
    [client]
  );

  const getRoastings = useCallback(() => {
    return client.query<{
      roastings: RoastingListItem[];
    }>({
      query: RoastingListQuery,
    });
  }, [client]);

  const getSyncState = useCallback(() => {
    return client.query<{
      sync: SyncState;
    }>({
      query: SyncStateQuery,
    });
  }, [client]);

  const createRoasting = useCallback(
    (date: string) => {
      return client.mutate<{
        createRoasting: SuccessResult;
      }>({
        mutation: CreateRoastingMutation,
        variables: {
          date,
        },
      });
    },
    [client]
  );

  const finishRoasting = useCallback(() => {
    return client.mutate<{
      finishRoasting: SuccessResult;
    }>({
      mutation: FinishRoastingMutation,
    });
  }, [client]);

  const startRoasting = useCallback(() => {
    return client.mutate<{
      startRoasting: SuccessResult;
    }>({
      mutation: StartRoastingMutation,
    });
  }, [client]);

  const finishBatch = useCallback(
    (roastedCoffeeId: number) => {
      return client.mutate<{
        finishBatch: SuccessResult;
      }>({
        mutation: FinishBatchMutation,
        variables: {
          roastedCoffeeId,
        },
      });
    },
    [client]
  );

  const reportRealYield = useCallback(
    (roastedCoffeeId: number, weight: number) => {
      return client.mutate<{
        reportRealYield: SuccessResult;
      }>({
        mutation: ReportRealYieldMutation,
        variables: {
          roastedCoffeeId,
          weight,
        },
      });
    },
    [client]
  );

  const selectOrdersRoasting = useCallback(
    (roastingId: string, orderId: number) => {
      return client.mutate<{
        selectOrdersRoasting: SuccessResult;
      }>({
        mutation: SelectOrdersRoastingMutation,
        variables: {
          roastingId,
          orderId,
        },
      });
    },
    [client]
  );

  const syncProducts = useCallback(() => {
    return client.mutate<{
      synchronizeProducts: null;
    }>({
      mutation: SynchronizeProductsMutation,
    });
  }, [client]);

  return {
    getProducts,
    getOrders,
    getRoastings,
    getSyncState,
    finishRoasting,
    finishBatch,
    startRoasting,
    syncProducts,
    createRoasting,
    selectOrdersRoasting,
    reportRealYield,
  };
};

export type ApiClient = ReturnType<typeof useBuildApiClient>;

export const ApiClientContext = React.createContext<ApiClient | null>(null);

export const useApiClient = () => {
  const api = useContext(ApiClientContext);

  if (!api) {
    throw new Error('Invalid state - can not use api outside app context');
  }

  return api;
};
