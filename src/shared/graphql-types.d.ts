export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Void: any;
};

export type GraphQLGreenCoffee = {
  __typename?: 'GreenCoffee';
  batchWeight: Scalars['Float'];
  id: Scalars['String'];
  name: Scalars['String'];
  roastingLossFactor: Scalars['Float'];
};

export type GraphQLLineItem = {
  __typename?: 'LineItem';
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  productId: Scalars['Int'];
  productName?: Maybe<Scalars['String']>;
  quantity: Scalars['Int'];
  variationId: Scalars['Int'];
};

export type GraphQLOrder = {
  __typename?: 'Order';
  dateCreated: Scalars['String'];
  dateModified: Scalars['String'];
  id: Scalars['Int'];
  lineItems: Array<Maybe<GraphQLLineItem>>;
  number: Scalars['Int'];
  roastingDate?: Maybe<Scalars['String']>;
  roastingId?: Maybe<Scalars['String']>;
  status: Scalars['String'];
};

export type GraphQLOrderList = {
  __typename?: 'OrderList';
  page?: Maybe<Scalars['Int']>;
  pageCount?: Maybe<Scalars['Int']>;
  rows: Array<Maybe<GraphQLOrder>>;
};

export type GraphQLProduct = {
  __typename?: 'Product';
  categories: Array<Maybe<GraphQLProductCategory>>;
  dateModified: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  images: Array<Maybe<GraphQLProductImages>>;
  name: Scalars['String'];
  roastedCoffeeId?: Maybe<Scalars['String']>;
  roastedCoffeeName?: Maybe<Scalars['String']>;
  shortDescription?: Maybe<Scalars['String']>;
  variations: Array<Maybe<GraphQLProductVariation>>;
};

export type GraphQLProductCategory = {
  __typename?: 'ProductCategory';
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
};

export type GraphQLProductImages = {
  __typename?: 'ProductImages';
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  src?: Maybe<Scalars['String']>;
};

export type GraphQLProductVariation = {
  __typename?: 'ProductVariation';
  id: Scalars['Int'];
  weight?: Maybe<Scalars['Float']>;
};

export type GraphQLRoastedCoffee = {
  __typename?: 'RoastedCoffee';
  greenCoffeeId: Scalars['String'];
  greenCoffeeName: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};

export type GraphQLRoasting = {
  __typename?: 'Roasting';
  finishedBatches: Array<Maybe<GraphQLRoastingFinishedBatch>>;
  greenCoffee: Array<Maybe<GraphQLRoastingGreenCoffee>>;
  id: Scalars['ID'];
  orders: Array<Maybe<GraphQLOrder>>;
  realYield: Array<Maybe<GraphQLRoastingRealYield>>;
  roastedCoffee: Array<Maybe<GraphQLRoastingRoastedCoffee>>;
  roastingDate: Scalars['String'];
  status: Scalars['String'];
};

export type GraphQLRoastingFinishedBatch = {
  __typename?: 'RoastingFinishedBatch';
  amount: Scalars['Int'];
  roastedCoffeeId: Scalars['String'];
};

export type GraphQLRoastingGreenCoffee = {
  __typename?: 'RoastingGreenCoffee';
  batchWeight: Scalars['Float'];
  id: Scalars['String'];
  name: Scalars['String'];
  roastingLossFactor: Scalars['Float'];
  weight: Scalars['Float'];
};

export type GraphQLRoastingRealYield = {
  __typename?: 'RoastingRealYield';
  roastedCoffeeId: Scalars['String'];
  weight: Scalars['Float'];
};

export type GraphQLRoastingRoastedCoffee = {
  __typename?: 'RoastingRoastedCoffee';
  expectedBatchYield: Scalars['Float'];
  finishedBatches: Scalars['Int'];
  id: Scalars['String'];
  name: Scalars['String'];
  numberOfBatches: Scalars['Float'];
  realYield: Scalars['Float'];
  weight: Scalars['Float'];
};

export type GraphQLRootMutation = {
  __typename?: 'RootMutation';
  assignProductToRoastedCoffee?: Maybe<GraphQLSuccessResult>;
  createGreenCoffee?: Maybe<GraphQLSuccessResult>;
  createRoastedCoffee?: Maybe<GraphQLSuccessResult>;
  createRoasting?: Maybe<GraphQLSuccessResult>;
  finishBatch?: Maybe<GraphQLSuccessResult>;
  finishRoasting?: Maybe<GraphQLSuccessResult>;
  reportRealYield?: Maybe<GraphQLSuccessResult>;
  selectOrdersRoasting?: Maybe<GraphQLSuccessResult>;
  startRoasting?: Maybe<GraphQLSuccessResult>;
  synchronizeProducts?: Maybe<Scalars['Void']>;
  updateGreenCoffee?: Maybe<GraphQLSuccessResult>;
  updateRoastedCoffee?: Maybe<GraphQLSuccessResult>;
};

export type GraphQLRootMutationAssignProductToRoastedCoffeeArgs = {
  id: Scalars['Int'];
  roastedCoffeeId: Scalars['String'];
};

export type GraphQLRootMutationCreateGreenCoffeeArgs = {
  batchWeight: Scalars['Float'];
  name: Scalars['String'];
  roastingLossFactor: Scalars['Float'];
};

export type GraphQLRootMutationCreateRoastedCoffeeArgs = {
  greenCoffeeId: Scalars['String'];
  name: Scalars['String'];
};

export type GraphQLRootMutationCreateRoastingArgs = {
  date: Scalars['String'];
};

export type GraphQLRootMutationFinishBatchArgs = {
  roastedCoffeeId: Scalars['String'];
};

export type GraphQLRootMutationReportRealYieldArgs = {
  roastedCoffeeId: Scalars['String'];
  weight: Scalars['Float'];
};

export type GraphQLRootMutationSelectOrdersRoastingArgs = {
  orderId: Scalars['Int'];
  roastingId: Scalars['String'];
};

export type GraphQLRootMutationUpdateGreenCoffeeArgs = {
  batchWeight: Scalars['Float'];
  id: Scalars['String'];
  name: Scalars['String'];
  roastingLossFactor: Scalars['Float'];
};

export type GraphQLRootMutationUpdateRoastedCoffeeArgs = {
  greenCoffeeId: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};

export type GraphQLRootQuery = {
  __typename?: 'RootQuery';
  greenCoffees: Array<Maybe<GraphQLGreenCoffee>>;
  orders?: Maybe<GraphQLOrderList>;
  products: Array<Maybe<GraphQLProduct>>;
  roastedCoffees: Array<Maybe<GraphQLRoastedCoffee>>;
  roastings: Array<Maybe<GraphQLRoasting>>;
  sync?: Maybe<GraphQLSync>;
};

export type GraphQLRootQueryOrdersArgs = {
  page?: Maybe<Scalars['Int']>;
};

export type GraphQLSuccessResult = {
  __typename?: 'SuccessResult';
  success?: Maybe<Scalars['Boolean']>;
};

export type GraphQLSync = {
  __typename?: 'Sync';
  lastOrderSyncTime: Scalars['String'];
  orderSyncDataVersion: Scalars['Int'];
  orderSyncError?: Maybe<Scalars['Boolean']>;
  orderSyncErrorMessage?: Maybe<Scalars['String']>;
  orderSyncInProgress: Scalars['Boolean'];
  productSyncDataVersion: Scalars['Int'];
  productSyncError?: Maybe<Scalars['Boolean']>;
  productSyncErrorMessage?: Maybe<Scalars['String']>;
  productSyncInProgress: Scalars['Boolean'];
};
