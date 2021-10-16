import { buildSchema } from 'graphql';

export const appSchema = buildSchema(`

    scalar Void

    type GreenCoffee {
        id: String!
        name: String!
        batchWeight: Float!
        roastingLossFactor: Float!
    }

    type RoastedCoffee {
        id: String!
        name: String!
        greenCoffeeId: String!
        greenCoffeeName: String!
    }

    type RoastingGreenCoffee {
        id: String!
        name: String!
        batchWeight: Float!
        roastingLossFactor: Float!
        weight: Float!
    }

    type RoastingRoastedCoffee {
        id: String!
        name: String!
        numberOfBatches: Float!
        finishedBatches: Int!
        weight: Float!
        realYield: Float!
        expectedBatchYield: Float!
    }

    type RoastingFinishedBatch {
        roastedCoffeeId: String!
        amount: Int!
    }

    type RoastingRealYield {
        roastedCoffeeId: String!
        weight: Float!
    }

    type Roasting {
        id: ID!
        status: String!
        roastingDate: String!
        orders: [Order]!
        greenCoffee: [RoastingGreenCoffee]!
        roastedCoffee: [RoastingRoastedCoffee]!
        finishedBatches: [RoastingFinishedBatch]!
        realYield: [RoastingRealYield]!
    }

    type WarehouseRoastedCoffeeEventWithAmount {
        type: String!
        timestamp: String!
        amount: Float!
    }

    type WarehouseRoastedCoffee {
        roastedCoffeeId: ID!
        roastedCoffeeName: String!
        quantityOnHand: Float!
        lastUpdateReason: String
        lastUpdated: String
        history: [WarehouseRoastedCoffeeEventWithAmount]!
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
        roastedCoffeeId: String
        roastedCoffeeName: String
    }

    type LineItem {
        id: Int!
        name: String
        productName: String
        productId: Int!
        variationId: Int!
        quantity: Int!
    }

    type Order {
        id: Int!
        number: Int!
        status: String!
        dateCreated: String!
        dateModified: String!
        lineItems: [LineItem]!
        roastingId: String
        roastingDate: String
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
        warehouseRoastedCoffees: [WarehouseRoastedCoffee]!
        orders(page: Int): OrderList
        products: [Product]!
        roastings: [Roasting]!
        sync: Sync
    }

    type RootMutation {

        createGreenCoffee(name: String!, batchWeight: Float!, roastingLossFactor: Float!): SuccessResult
        updateGreenCoffee(id: String!, name: String!, batchWeight: Float!, roastingLossFactor: Float!): SuccessResult

        createRoastedCoffee(name: String!, greenCoffeeId: String!): SuccessResult
        updateRoastedCoffee(id: String!, name: String!, greenCoffeeId: String!): SuccessResult

        assignProductToRoastedCoffee(id: Int!, roastedCoffeeId: String!): SuccessResult

        createRoasting(date: String!): SuccessResult
        selectOrdersRoasting(roastingId: String!, orderId: Int!): SuccessResult
        startRoasting: SuccessResult
        finishBatch(roastedCoffeeId: String!): SuccessResult
        reportRealYield(roastedCoffeeId: String!, weight: Float!): SuccessResult
        finishRoasting: SuccessResult

        addRoastingLeftovers: SuccessResult
        adjustRoastedCoffeeLeftovers(roastedCoffeeId: String!, newAmount: Float!): SuccessResult
        useRoastedCoffeeLeftovers(roastedCoffeeId: String!, amount: Float!): SuccessResult
        
        synchronizeProducts: Void

    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }

`);
