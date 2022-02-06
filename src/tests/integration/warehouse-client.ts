import { APIRequestContext } from '@playwright/test';

import {
  AddRoastingLeftoversProps,
  AdjustRoastedCoffeeLeftoversProps,
  GetWarehouseRoastedCoffeesResult,
  UseRoastedCoffeeLeftoversProps,
} from './../../server/modules/warehouse/features/warehouse-roasted-coffee-features';

const url = `http://localhost:3003/api/graphql`;

export const getWarehouseRoastedCoffees = async (
  request: APIRequestContext
): Promise<GetWarehouseRoastedCoffeesResult> => {
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

  console.log(data);

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

  return result.status();
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

  return result.status();
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

  return result.status();
};
