import { gql } from '@apollo/client'

export const ProductQuery = gql`
  query GetProducts {
    products {
      id
      name
      description
      shortDescription
      dateModified
      price
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
