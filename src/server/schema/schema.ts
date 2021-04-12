import { buildSchema } from 'graphql'

export const appSchema = buildSchema(`

    type ProductCategory {
        id: ID!
        name: String!
    }

    type ProductImages {
        id: Int!
        name: String!
        src: String!
    }

    type Product {
        id: ID!
        name: String!
        dateModified: String!
        slug: String!
        description: String
        shortDescription: String
        price: Int
        categories: [ProductCategory]!
        images: [ProductImages]!
    }

    type Category {
        id: ID!
        name: String!
        description: String
    }

    type Order {
        id: ID!
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
