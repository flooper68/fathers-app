import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import React, { useCallback, useMemo } from 'react'
import { useContext } from 'react'

import { CategoryQuery, OrdersQuery, ProductQuery } from './graphql-queries'

export const useBuildApiClient = (
  client: ApolloClient<NormalizedCacheObject>
) => {
  const getProducts = useCallback(() => {
    return client.query({
      query: ProductQuery,
    })
  }, [client])

  const getCategories = useCallback(() => {
    return client.query({
      query: CategoryQuery,
    })
  }, [client])

  const getOrders = useCallback(() => {
    return client.query({
      query: OrdersQuery,
    })
  }, [client])

  return useMemo(
    () => ({
      getProducts,
      getCategories,
      getOrders,
    }),
    [getProducts, getCategories, getOrders]
  )
}

export type ApiClient = ReturnType<typeof useBuildApiClient>

export const ApiClientContext = React.createContext<ApiClient | null>(null)

export const useApiClient = () => {
  const context = useContext(ApiClientContext)

  if (!context) {
    throw new Error('Invalid state - can not use api outside app context')
  }

  return context
}
