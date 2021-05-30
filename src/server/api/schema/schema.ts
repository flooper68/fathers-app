import { buildSchema } from 'graphql'

export const appSchema = buildSchema(`

    type ProductCategory {
        id: Int!
        name: String
    }

    type ProductImages {
        id: Int!
        name: String
        src: String
    }

    type ProductVariation {
        id: Int!
        weight: Float
    }

    type Product {
        id: Int!
        name: String!
        dateModified: String!
        description: String
        shortDescription: String
        images: [ProductImages]!
        categories: [ProductCategory]!
        variations: [ProductVariation]!
        roastedCoffeeCategoryId: String
    }

    type LineItem {
        id: Int!
        name: String
        productName: String
        productId: Int!
        variationId: Int!
        quantity: Int!
        product: Product!
    }

    type Order {
        id: Int!
        number: Int!
        status: String!
        dateCreated: String!
        dateModified: String!
        roastingId: String
        roasted: Boolean!
        lineItems: [LineItem]!
    }

    type RootQuery {
        orders: [Order]!
        products: [Product]!
    }

    schema {
        query: RootQuery
    }
    
`)
