import {
  AddGreenCoffeeProps,
  AddRoastedCoffeeProps,
  AssignProductVariationProps,
  GetRoastingSettingsResult,
  UpdateGreenCoffeeProps,
  UpdateRoastedCoffeeProps,
} from './../../server/modules/roasting/features/roasting-settings-feature';
import { APIRequestContext } from '@playwright/test';

const url = `http://localhost:3003/api/graphql`;

export const getRoastingSettings = async (
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

export const addGreenCoffee = async (
  request: APIRequestContext,
  props: AddGreenCoffeeProps
) => {
  const result = await request.post(url, {
    data: {
      query: `
        mutation {
          addGreenCoffee(props:{
            uuid: "${props.uuid}",
            correlationUuid: "${props.correlationUuid}",
            name: "${props.name}",
            batchWeight: ${props.batchWeight},
            roastingLossFactor: ${props.roastingLossFactor},
            
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

export const updateGreenCoffee = async (
  request: APIRequestContext,
  props: UpdateGreenCoffeeProps
) => {
  const result = await request.post(url, {
    data: {
      query: `
        mutation {
          updateGreenCoffee(props:{
            uuid: "${props.uuid}",
            correlationUuid: "${props.correlationUuid}",
            name: "${props.name}",
            batchWeight: ${props.batchWeight},
            roastingLossFactor: ${props.roastingLossFactor},
            
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

export const addRoastedCoffee = async (
  request: APIRequestContext,
  props: AddRoastedCoffeeProps
) => {
  const result = await request.post(url, {
    data: {
      query: `
        mutation {
          addRoastedCoffee(props:{
            uuid: "${props.uuid}",
            correlationUuid: "${props.correlationUuid}",
            name: "${props.name}",
            greenCoffeeUuid: "${props.greenCoffeeUuid}"
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

export const updateRoastedCoffee = async (
  request: APIRequestContext,
  props: UpdateRoastedCoffeeProps
) => {
  const result = await request.post(url, {
    data: {
      query: `
        mutation {
          updateRoastedCoffee(props:{
            uuid: "${props.uuid}",
            correlationUuid: "${props.correlationUuid}",
            name: "${props.name}",
            greenCoffeeUuid: "${props.greenCoffeeUuid}"
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

export const assignProductVariation = async (
  request: APIRequestContext,
  props: AssignProductVariationProps
) => {
  const result = await request.post(url, {
    data: {
      query: `
        mutation {
          assignProductVariation(props: {
            id: ${props.id},
            weight: ${props.weight},
            roastedCoffeeUuid: "${props.roastedCoffeeUuid}",
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
