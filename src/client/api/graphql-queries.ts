import { gql } from '@apollo/client'

export const ProductQuery = gql`
  query GetProducts {
    products {
      id
      name
    }
  }
`

export const CategoryQuery = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`

export const OrdersQuery = gql`
  query GetOrders {
    orders {
      id
      number
      status
    }
  }
`
