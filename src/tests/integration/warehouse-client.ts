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
  props: {
    roastingId: string;
    roastedCoffeeId: string;
    amount: number;
    timestamp: string;
    correlationUuid: string;
  }
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
