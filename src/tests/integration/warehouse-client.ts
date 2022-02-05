import {
  AddRoastingLeftoversProps,
  AdjustRoastedCoffeeLeftoversProps,
  UseRoastedCoffeeLeftoversProps,
} from './../../server/modules/warehouse/features/warehouse-roasted-coffee-features';
import { APIRequestContext } from '@playwright/test';

const url = `http://localhost:3003/api/graphql`;

export const getWarehouseRoastedCoffees = async (
  request: APIRequestContext
) => {
  const result = await request.post(url, {
    data: {
      query: `
            query {
              warehouseRoastedCoffees {
                roastedCoffeeId
                lastUpdated
                quantityOnHand
                lastUpdateReason
              }
            }
           `,
      variables: null,
    },
  });

  const data = await result.json();

  return data.data.warehouseRoastedCoffees;
};

export const addWarehouseRoastedCoffees = async (
  request: APIRequestContext,
  props: AddRoastingLeftoversProps
) => {
  const result = await request.post(url, {
    data: {
      query: `
        mutation {
        addRoastedCoffeeLeftOvers(props: {
          roastingId: "${props.roastingId}",
          roastedCoffeeId: "${props.roastedCoffeeId}",
          amount: ${props.amount},
          timestamp: "${props.timestamp}",
          correlationUuid: "${props.correlationUuid}"
        }) {
          success
        }
      }
             `,
      variables: null,
    },
  });

  const data = await result.json();

  return data.data;
};

export const useWarehouseRoastedCoffees = async (
  request: APIRequestContext,
  props: UseRoastedCoffeeLeftoversProps
) => {
  const result = await request.post(url, {
    data: {
      query: `
        mutation {
          useRoastedCoffeeLeftOvers(props: {
          roastedCoffeeId: "${props.roastedCoffeeId}",
          amount: ${props.amount},
          timestamp: "${props.timestamp}",
          correlationUuid: "${props.correlationUuid}"
        }) {
          success
        }
      }
             `,
      variables: null,
    },
  });

  const data = await result.json();

  return data.data;
};

export const adjustWarehouseRoastedCoffees = async (
  request: APIRequestContext,
  props: AdjustRoastedCoffeeLeftoversProps
) => {
  const result = await request.post(url, {
    data: {
      query: `
        mutation {
          adjustRoastedCoffeeLeftOvers(props: {
          roastedCoffeeId: "${props.roastedCoffeeId}",
          newAmount: ${props.newAmount},
          timestamp: "${props.timestamp}",
          correlationUuid: "${props.correlationUuid}"
        }) {
          success
        }
      }
             `,
      variables: null,
    },
  });

  const data = await result.json();

  return data.data;
};
