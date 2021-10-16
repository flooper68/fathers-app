import { UpdateRoastedCoffeeMutation } from './queries/update-roasted-coffee-mutation';
import { AssignRoastedCoffeeMutation } from './queries/assign-roasted-coffee-mutation';
import { CreateRoastedCoffeeMutation } from './queries/create-roasted-coffee-mutation';
import {
  RoastedCoffeeListItem,
  RoastedCoffeeQuery,
} from './queries/get-roasted-coffee-query';
import { CreateGreenCoffeeMutation } from './queries/create-green-coffee-mutation';
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
import {
  GreenCoffeeListItem,
  GreenCoffeeQuery,
} from './queries/get-green-coffee-query';
import { UpdateGreenCoffeeMutation } from './queries/update-green-coffee-mutation';
import {
  WarehouseRoastedCoffeeListItem,
  WarehouseRoastedCoffeeListQuery,
} from './queries/get-warehouse-roasted-coffee';
import { AdjustRoastedCoffeeLeftoversMutation } from './queries/adjust-roasted-coffee-leftovers-mutation ';
import { UseRoastedCoffeeLeftoversMutation } from './queries/use-roasted-coffee-leftovers-mutation';

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

  const getGreenCoffees = useCallback(() => {
    return client.query<{
      greenCoffees: GreenCoffeeListItem[];
    }>({
      query: GreenCoffeeQuery,
    });
  }, [client]);

  const getRoastedCoffees = useCallback(() => {
    return client.query<{
      roastedCoffees: RoastedCoffeeListItem[];
    }>({
      query: RoastedCoffeeQuery,
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

  const getWarehouseRoastedCoffee = useCallback(() => {
    return client.query<{
      warehouseRoastedCoffees: WarehouseRoastedCoffeeListItem[];
    }>({
      query: WarehouseRoastedCoffeeListQuery,
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

  const createGreenCoffee = useCallback(
    (data: {
      name: string;
      batchWeight: number;
      roastingLossFactor: number;
    }) => {
      return client.mutate<{
        createGreenCoffee: SuccessResult;
      }>({
        mutation: CreateGreenCoffeeMutation,
        variables: data,
      });
    },
    [client]
  );

  const createRoastedCoffee = useCallback(
    (data: { name: string; greenCoffeeId: string }) => {
      return client.mutate<{
        createRoastedCoffee: SuccessResult;
      }>({
        mutation: CreateRoastedCoffeeMutation,
        variables: data,
      });
    },
    [client]
  );

  const updateGreenCoffee = useCallback(
    (data: {
      id: string;
      name: string;
      batchWeight: number;
      roastingLossFactor: number;
    }) => {
      return client.mutate<{
        updateGreenCoffee: SuccessResult;
      }>({
        mutation: UpdateGreenCoffeeMutation,
        variables: data,
      });
    },
    [client]
  );

  const adjustRoastedCoffeeLeftovers = useCallback(
    (data: { roastedCoffeeId: string; newAmount: number }) => {
      return client.mutate<{
        adjustRoastedCoffeeLeftovers: SuccessResult;
      }>({
        mutation: AdjustRoastedCoffeeLeftoversMutation,
        variables: data,
      });
    },
    [client]
  );

  const useRoastedCoffeeLeftovers = useCallback(
    (data: { roastedCoffeeId: string; amount: number }) => {
      return client.mutate<{
        useRoastedCoffeeLeftovers: SuccessResult;
      }>({
        mutation: UseRoastedCoffeeLeftoversMutation,
        variables: data,
      });
    },
    [client]
  );

  const updateRoastedCoffee = useCallback(
    (data: { id: string; name: string; greenCoffeeId: string }) => {
      return client.mutate<{
        updateRoastedCoffee: SuccessResult;
      }>({
        mutation: UpdateRoastedCoffeeMutation,
        variables: data,
      });
    },
    [client]
  );

  const assignRoastedCoffee = useCallback(
    (data: { id: number; roastedCoffeeId: string }) => {
      return client.mutate<{
        assignProductToRoastedCoffee: SuccessResult;
      }>({
        mutation: AssignRoastedCoffeeMutation,
        variables: data,
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
    getGreenCoffees,
    getRoastedCoffees,
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
    createGreenCoffee,
    createRoastedCoffee,
    updateGreenCoffee,
    assignRoastedCoffee,
    updateRoastedCoffee,
    getWarehouseRoastedCoffee,
    adjustRoastedCoffeeLeftovers,
    useRoastedCoffeeLeftovers,
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
