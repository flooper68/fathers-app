import { buildSchema } from 'graphql'

export const appSchema = buildSchema(`

    type Product {
        id: String!
        name: String!
    }

    type Category {
        id: String!
        name: String!
        description: String
    }

    type Order {
        id: String!
        number: Int!
        status: String!
    }

    type RootQuery {
        products: [Product]!
        categories: [Category]!
        orders: [Order]!
    }

    schema {
        query: RootQuery
    }
    
`)
