import { gql } from '@apollo/client'

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
}

export const OrdersListQuery = gql`
  query GetOrders {
    orders {
      id
      number
      status
      dateCreated
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
