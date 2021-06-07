import { buildSchema } from 'graphql'

export const appSchema = buildSchema(`

    scalar Void

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


    type RoastingGreenCoffee {
        id: Int!
        name: String!
        batchWeight: Float!
        roastingLossFactor: Float!
        weight: Float!
    }

    type RoastingRoastedCoffee {
        id: Int!
        name: String!
        numberOfBatches: Float!
        finishedBatches: Int!
        weight: Float!
        realYield: Float!
    }

    type Roasting {
        id: ID!
        dateCreated: String!
        datePlanningClosed: String
        dateFinished: String
        status: String!
        totalWeight: Float!
        orderIds: [Int]!
        orders: [Order]!
        greenCoffee: [RoastingGreenCoffee]
        roastedCoffee: [RoastingRoastedCoffee]

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

    type OrderList {
        page: Int
        pageCount: Int
        rows: [Order]!
    }

    type Sync {
        lastOrderSyncTime: String!
        orderSyncInProgress: Boolean!
        orderSyncDataVersion: Int!
        orderSyncErrorMessage: String
        orderSyncError: Boolean
        productSyncInProgress: Boolean!
        productSyncDataVersion: Int!
        productSyncError: Boolean
        productSyncErrorMessage: String
    }

    type SuccessResult {
        success: Boolean
    }

    type RootQuery {
        greenCoffees: [GreenCoffee]!
        roastedCoffees: [RoastedCoffee]!
        orders(page: Int): OrderList
        products: [Product]!
        roastings: [Roasting]!
        sync: Sync
    }


    type RooMutation {
        finishRoasting: SuccessResult
        closePlanning: SuccessResult
        synchronizeProducts: Void

    }

    schema {
        query: RootQuery
        mutation: RooMutation
    }
    
`)
