import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { useStore, useSelector } from 'react-redux'
import { useCallback, useEffect } from 'react'

import { Logger } from '../../shared/logger'
import { ApiClient } from '../api/api-client'
import { StoreState } from '../store'
import notification from 'antd/lib/notification'

interface InitialState {
  lastOrderSyncTime: string
  orderSyncInProgress: boolean
  orderSyncDataVersion: number
  orderSyncError?: boolean
  orderSyncErrorMessage?: string
  productSyncInProgress: boolean
  productSyncDataVersion: number
  productSyncError?: boolean
  productSyncErrorMessage?: string
}

const initialState: InitialState = {
  lastOrderSyncTime: '',
  orderSyncInProgress: false,
  orderSyncDataVersion: 0,
  productSyncInProgress: false,
  productSyncDataVersion: 0,
}

const { actions, reducer } = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    updateOrderSyncState: (
      state,
      action: PayloadAction<{
        lastOrderSyncTime?: string
        orderSyncInProgress?: boolean
        orderSyncDataVersion?: number
        orderSyncError?: boolean
        orderSyncErrorMessage?: string
      }>
    ) => {
      return {
        ...state,
        ...action.payload,
      }
    },
    updateProductSyncState: (
      state,
      action: PayloadAction<{
        productSyncInProgress?: boolean
        productSyncDataVersion?: number
        productSyncError?: boolean
        productSyncErrorMessage?: string
      }>
    ) => {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
})

export const syncActions = actions
export const syncReducer = reducer

const getSyncState = (state: StoreState) => state.sync
export const getOrderLastSyncDate = createSelector(
  getSyncState,
  (state) => state.lastOrderSyncTime
)
export const getOrderSyncInProgress = createSelector(
  getSyncState,
  (state) => state.orderSyncInProgress
)
export const getProductSyncInProgress = createSelector(
  getSyncState,
  (state) => state.productSyncInProgress
)
export const getOrderSyncDataVersion = createSelector(
  getSyncState,
  (state) => state.orderSyncDataVersion
)
export const getProductSyncDataVersion = createSelector(
  getSyncState,
  (state) => state.productSyncDataVersion
)
export const getOrderSyncError = createSelector(
  getSyncState,
  (state) => state.orderSyncError
)
export const getOrderSyncErrorMessage = createSelector(
  getSyncState,
  (state) => state.orderSyncErrorMessage
)
export const getOrderSyncErrorData = createSelector(
  getOrderSyncError,
  getOrderSyncErrorMessage,
  (error, message) => ({ error, message })
)
export const getProductSyncError = createSelector(
  getSyncState,
  (state) => state.productSyncError
)
export const getProductSyncErrorMessage = createSelector(
  getSyncState,
  (state) => state.productSyncErrorMessage
)
export const getProductSyncErrorData = createSelector(
  getProductSyncError,
  getProductSyncErrorMessage,
  (error, message) => ({ error, message })
)

const notifyOrdersAdded = () => {
  notification.open({
    message: 'Přibyly nové objednávky',
  })
}

const notifySyncError = (message: string) => {
  notification.error({
    message: 'Došlo k chybě při synchronizaci',
    description: message,
    duration: 0,
  })
}

export const useAppSync = (apiClient: ApiClient) => {
  const store = useStore()

  const orderDataVersion = useSelector(getOrderSyncDataVersion)
  const orderSyncError = useSelector(getOrderSyncErrorData)
  const productSyncError = useSelector(getProductSyncErrorData)

  const syncState = useCallback(async () => {
    Logger.debug(`Syncing state`)
    try {
      const {
        data: { sync },
      } = await apiClient.getSyncState()

      store.dispatch(
        syncActions.updateOrderSyncState({
          lastOrderSyncTime: sync.lastOrderSyncTime,
          orderSyncInProgress: sync.orderSyncInProgress,
          orderSyncDataVersion: sync.orderSyncDataVersion,
          orderSyncError: sync.orderSyncError,
          orderSyncErrorMessage: sync.orderSyncErrorMessage,
        })
      )

      store.dispatch(
        syncActions.updateProductSyncState({
          productSyncInProgress: sync.productSyncInProgress,
          productSyncDataVersion: sync.productSyncDataVersion,
          productSyncError: sync.productSyncError,
          productSyncErrorMessage: sync.productSyncErrorMessage,
        })
      )
    } catch (e) {
      Logger.error(`Error syncing with server`, e)
      notifySyncError(`Nepodařilo se spojit se serverem :-( `)
    }
  }, [apiClient, store])

  useEffect(() => {
    orderDataVersion > 1 && notifyOrdersAdded()
  }, [orderDataVersion])

  useEffect(() => {
    orderSyncError.error &&
      notifySyncError(orderSyncError.message || 'Něco se pokazilo :( ')
  }, [orderSyncError])

  useEffect(() => {
    productSyncError.error &&
      (productSyncError.message || 'Něco se pokazilo :( ')
  }, [productSyncError])

  useEffect(() => {
    const interval = setInterval(() => {
      syncState()
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [syncState])
}
