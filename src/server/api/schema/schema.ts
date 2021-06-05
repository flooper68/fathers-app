import { buildSchema } from 'graphql'

export const appSchema = buildSchema(`

    type GreenCoffee {
        id: Int!
        name: String!
        batchWeight: Float!
        roastingLossFactor: Float!
        roastedCoffees: [RoastedCoffee]!
    }

    type RoastedCoffee {
        id: Int!
        name: String!
        greenCoffeeId: Int!
        greenCoffee: GreenCoffee
    }

    type Roasting {
        id: ID!
        status: String!
        totalWeight: Float!
        orderIds: [Int]!
        orders: [Order]!
    }

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
        roastedCoffeeId: Int
        roastedCoffee: RoastedCoffee
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
        greenCoffees: [GreenCoffee]!
        roastedCoffees: [RoastedCoffee]!
        orders: [Order]!
        products: [Product]!
        roastings: [Roasting]!
    }

    schema {
        query: RootQuery
    }
    
`)
