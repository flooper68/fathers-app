import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import React, { useCallback, useMemo } from 'react'
import { useContext } from 'react'

import {
  OrdersListQuery,
  ProductListItem,
  ProductListQuery,
  RoastingListItem,
  RoastingListQuery,
  SyncState,
  SyncStateQuery,
  SuccessResult,
  FinishRoastingMutation,
  ClosePlanningMutation,
  SynchronizeProductsMutation,
  OrderListResult,
} from './graphql-queries'

export const useBuildApiClient = (
  client: ApolloClient<NormalizedCacheObject>
) => {
  const getProducts = useCallback(() => {
    return client.query<{
      products: ProductListItem[]
    }>({
      query: ProductListQuery,
    })
  }, [client])

  const getOrders = useCallback(
    (page: number) => {
      return client.query<{
        orders: OrderListResult
      }>({
        query: OrdersListQuery,
        variables: { page },
      })
    },
    [client]
  )

  const getRoastings = useCallback(() => {
    return client.query<{
      roastings: RoastingListItem[]
    }>({
      query: RoastingListQuery,
    })
  }, [client])

  const getSyncState = useCallback(() => {
    return client.query<{
      sync: SyncState
    }>({
      query: SyncStateQuery,
    })
  }, [client])

  const finishRoasting = useCallback(() => {
    return client.mutate<{
      finishRoasting: SuccessResult
    }>({
      mutation: FinishRoastingMutation,
    })
  }, [client])

  const closePlanning = useCallback(() => {
    return client.mutate<{
      closePlanning: SuccessResult
    }>({
      mutation: ClosePlanningMutation,
    })
  }, [client])

  const syncProducts = useCallback(() => {
    return client.mutate<{
      synchronizeProducts: null
    }>({
      mutation: SynchronizeProductsMutation,
    })
  }, [client])

  return useMemo(
    () => ({
      getProducts,
      getOrders,
      getRoastings,
      getSyncState,
      finishRoasting,
      closePlanning,
      syncProducts,
    }),
    [
      getProducts,
      getOrders,
      getRoastings,
      getSyncState,
      finishRoasting,
      closePlanning,
      syncProducts,
    ]
  )
}

export type ApiClient = ReturnType<typeof useBuildApiClient>

export const ApiClientContext = React.createContext<ApiClient | null>(null)

export const useApiClient = () => {
  const api = useContext(ApiClientContext)

  if (!api) {
    throw new Error('Invalid state - can not use api outside app context')
  }

  return api
}
