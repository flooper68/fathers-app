import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import React, { useCallback, useMemo } from 'react'
import { useContext } from 'react'

import {
  OrdersListQuery,
  ProductListItem,
  ProductListQuery,
  OrderListItem,
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

  const getOrders = useCallback(() => {
    return client.query<{
      orders: OrderListItem[]
    }>({
      query: OrdersListQuery,
    })
  }, [client])

  return useMemo(
    () => ({
      getProducts,
      getOrders,
    }),
    [getProducts, getOrders]
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
