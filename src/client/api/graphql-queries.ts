import { RoastingStatus } from './../../shared/types/roasting'
import { gql } from '@apollo/client'

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
`

export interface SyncState {
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

export const ProductListQuery = gql`
  query GetProducts {
    products {
      id
      name
      description
      shortDescription
      dateModified
      categories {
        id
        name
      }
      images {
        id
        src
        name
      }
      variations {
        weight
      }
      roastedCoffee {
        name
      }
    }
  }
`

export interface ProductListItem {
  id: number
  name: string
  description: string
  shortDescription: string
  dateModified: string
  categories: {
    id: number
    name: string
  }[]
  images: {
    id: number
    src: string
    name: string
  }[]
  variations: { weight: number }[]
  roastedCoffee: { name: string }
}

export const OrdersListQuery = gql`
  query GetOrders {
    orders {
      id
      number
      status
      dateCreated
      roastingId
      lineItems {
        name
        quantity
        variationId
        product {
          categories {
            name
          }
          variations {
            id
            weight
          }
        }
      }
    }
  }
`

export interface OrderListItem {
  id: number
  number: number
  status: string
  dateCreated: string
  roastingId: string
  lineItems: {
    name: string
    quantity: number
    variationId: number
    product: {
      categories: {
        name: string
      }[]
      variations: {
        id: number
        weight: number
      }[]
    }
  }[]
}

export const RoastingListQuery = gql`
  query GetRoastings {
    roastings {
      id
      dateCreated
      dateFinished
      datePlanningClosed
      status
      totalWeight
      greenCoffee {
        id
        name
        batchWeight
        roastingLossFactor
        weight
      }
      roastedCoffee {
        id
        name
        numberOfBatches
        finishedBatches
        weight
        realYield
      }
      orders {
        id
        number
        status
        dateCreated
        roastingId
        lineItems {
          name
          quantity
          variationId
          product {
            categories {
              name
            }
            variations {
              id
              weight
            }
          }
        }
      }
    }
  }
`

export interface RoastingListItem {
  id: number
  dateCreated: string
  datePlanningClosed: string
  dateFinished: string
  status: RoastingStatus
  totalWeight: number
  greenCoffee: {
    id: number
    name: string
    batchWeight: number
    roastingLossFactor: number
    weight: number
  }[]
  roastedCoffee: {
    id: number
    name: string
    numberOfBatches: number
    finishedBatches: number
    weight: number
    realYield: number
  }[]
  orders: OrderListItem[]
}

export interface SuccessResult {
  success: boolean
}

export const FinishRoastingMutation = gql`
  mutation FinishRoasting {
    finishRoasting {
      success
    }
  }
`

export const ClosePlanningMutation = gql`
  mutation ClosePlanning {
    closePlanning {
      success
    }
  }
`

export const SynchronizeProductsMutation = gql`
  mutation SynchronizeProducts {
    synchronizeProducts
  }
`
