import { v4 } from 'uuid';

import {
  AddGreenCoffeeProps,
  AddRoastedCoffeeProps,
  AssignProductVariationProps,
  UpdateGreenCoffeeProps,
  UpdateRoastedCoffeeProps,
} from '../../server/modules/roasting/features/roasting-settings-feature';

export const getNewGreenCoffeeProps = (): AddGreenCoffeeProps => ({
  correlationUuid: v4(),
  uuid: '35938398-15d6-4ce7-a5a6-28b96e0d3381',
  name: 'Green Coffee',
  batchWeight: 8,
  roastingLossFactor: 0.8,
});

export const getUpdateGreenCoffeeProps = (): UpdateGreenCoffeeProps => ({
  correlationUuid: v4(),
  uuid: '35938398-15d6-4ce7-a5a6-28b96e0d3381',
  name: 'New Green Coffee',
  batchWeight: 3,
  roastingLossFactor: 0.1,
});

export const getNewRoastedCoffeeProps = (): AddRoastedCoffeeProps => ({
  correlationUuid: v4(),
  uuid: 'd4ad00bb-609b-4a1d-b5bc-5b99104a73dd',
  name: 'New Roasted Coffee',
  greenCoffeeUuid: getNewGreenCoffeeProps().uuid,
});

export const getUpdatedRoastedCoffeeProps = (): UpdateRoastedCoffeeProps => ({
  correlationUuid: v4(),
  uuid: 'd4ad00bb-609b-4a1d-b5bc-5b99104a73dd',
  name: 'Updated Roasted Coffee',
  greenCoffeeUuid: getNewGreenCoffeeProps().uuid,
});

export const getAssignProductVariationProps =
  (): AssignProductVariationProps => ({
    correlationUuid: v4(),
    id: 1,
    weight: 20.7,
    roastedCoffeeUuid: getNewRoastedCoffeeProps().uuid,
  });
