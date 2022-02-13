import { APIRequestContext } from '@playwright/test';

import { CreateRoastingProps } from '../../server/modules/roasting/features/roasting-feature';
import { GetRoastingSettingsResult } from '../../server/modules/roasting/features/roasting-settings-feature';

const url = `http://localhost:3003/api/graphql`;

export const getRoastings = async (
  request: APIRequestContext
): Promise<GetRoastingSettingsResult> => {
  const result = await request.post(url, {
    data: {
      query: `
            query {
              roastingSettings {
                greenCoffees {
                  uuid
                  name
                  roastingLossFactor
                  batchWeight
                }
                roastedCoffees {
                  uuid
                  name
                  greenCoffeeUuid
                }
                productVariations {
                  id
                  weight
                  roastedCoffeeUuid
                }
              }
            }
           `,
      variables: null,
    },
  });

  const data = await result.json();

  return data.data.roastingSettings;
};

export const createRoasting = async (
  request: APIRequestContext,
  props: CreateRoastingProps
) => {
  const result = await request.post(url, {
    data: {
      query: `
        mutation {
          createRoasting(props:{
            uuid: "${props.uuid}",
            correlationUuid: "${props.correlationUuid}",
            roastingDate: "${props.roastingDate}"
            
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
