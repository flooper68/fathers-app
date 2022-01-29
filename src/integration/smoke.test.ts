/**
 * @jest-environment node
 */

import 'cross-fetch/polyfill';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import {
  ProductListItem,
  ProductListQuery,
} from '../client/api/queries/get-products-query';

const apolloClient = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

describe('smoke integration test', () => {
  it('smokes', async () => {
    const test = await apolloClient.query<{
      products: ProductListItem[];
    }>({
      query: ProductListQuery,
    });
    expect(true);
  });
});
