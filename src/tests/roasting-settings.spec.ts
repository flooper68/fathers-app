import { test, expect } from '@playwright/test';
import { v4 } from 'uuid';

import { cleanUpData } from './support/clean-data';
import {
  addGreenCoffee,
  addRoastedCoffee,
  assignProductVariation,
  getRoastingSettings,
  updateGreenCoffee,
  updateRoastedCoffee,
} from './integration/roasting-client';
import {
  AddRoastedCoffeeProps,
  AssignProductVariationProps,
  UpdateGreenCoffeeProps,
} from '../server/modules/roasting/features/roasting-settings-feature';
import { AddGreenCoffeeProps } from './../server/modules/roasting/features/roasting-settings-feature';

const getNewGreenCoffeeProps = (): AddGreenCoffeeProps => ({
  correlationUuid: v4(),
  uuid: '35938398-15d6-4ce7-a5a6-28b96e0d3381',
  name: 'Green Coffee',
  batchWeight: 8,
  roastingLossFactor: 0.8,
});

const getUpdateGreenCoffeeProps = (): UpdateGreenCoffeeProps => ({
  correlationUuid: v4(),
  uuid: '35938398-15d6-4ce7-a5a6-28b96e0d3381',
  name: 'New Green Coffee',
  batchWeight: 3,
  roastingLossFactor: 0.1,
});

const getNewRoastedCoffeeProps = (): AddRoastedCoffeeProps => ({
  correlationUuid: v4(),
  uuid: 'd4ad00bb-609b-4a1d-b5bc-5b99104a73dd',
  name: 'New Roasted Coffee',
  greenCoffeeUuid: getNewGreenCoffeeProps().uuid,
});

const getUpdatedRoastedCoffeeProps = (): AddRoastedCoffeeProps => ({
  correlationUuid: v4(),
  uuid: 'd4ad00bb-609b-4a1d-b5bc-5b99104a73dd',
  name: 'Updated Roasted Coffee',
  greenCoffeeUuid: getNewGreenCoffeeProps().uuid,
});

const getAssignProductVariationProps = (): AssignProductVariationProps => ({
  correlationUuid: v4(),
  id: 1,
  weight: 20.7,
  roastedCoffeeUuid: getNewRoastedCoffeeProps().uuid,
});

test('should create a new green coffee', async ({ request }) => {
  await cleanUpData();

  const success = await addGreenCoffee(request, getNewGreenCoffeeProps());

  expect(success).toBe(200);

  const result = await getRoastingSettings(request);

  expect(result.greenCoffees).toHaveLength(1);
  expect(result.greenCoffees[0]).toEqual({
    uuid: getNewGreenCoffeeProps().uuid,
    name: getNewGreenCoffeeProps().name,
    batchWeight: getNewGreenCoffeeProps().batchWeight,
    roastingLossFactor: getNewGreenCoffeeProps().roastingLossFactor,
  });
});

test('should update existing green coffee', async ({ request }) => {
  await cleanUpData();

  await addGreenCoffee(request, getNewGreenCoffeeProps());
  const success = await updateGreenCoffee(request, getUpdateGreenCoffeeProps());

  expect(success).toBe(200);

  const result = await getRoastingSettings(request);

  expect(result.greenCoffees).toHaveLength(1);
  expect(result.greenCoffees[0]).toEqual({
    uuid: getUpdateGreenCoffeeProps().uuid,
    name: getUpdateGreenCoffeeProps().name,
    batchWeight: getUpdateGreenCoffeeProps().batchWeight,
    roastingLossFactor: getUpdateGreenCoffeeProps().roastingLossFactor,
  });
});

test('should add new roasted coffee', async ({ request }) => {
  await cleanUpData();

  await addGreenCoffee(request, getNewGreenCoffeeProps());
  const success = await addRoastedCoffee(request, getNewRoastedCoffeeProps());

  expect(success).toBe(200);

  const result = await getRoastingSettings(request);

  expect(result.roastedCoffees).toHaveLength(1);
  expect(result.roastedCoffees[0]).toEqual({
    uuid: getNewRoastedCoffeeProps().uuid,
    name: getNewRoastedCoffeeProps().name,
    greenCoffeeUuid: getNewRoastedCoffeeProps().greenCoffeeUuid,
  });
});

test('should update existing roasted coffee', async ({ request }) => {
  await cleanUpData();

  await addGreenCoffee(request, getNewGreenCoffeeProps());
  await addRoastedCoffee(request, getNewRoastedCoffeeProps());
  const success = await updateRoastedCoffee(
    request,
    getUpdatedRoastedCoffeeProps()
  );

  expect(success).toBe(200);

  const result = await getRoastingSettings(request);

  expect(result.roastedCoffees).toHaveLength(1);
  expect(result.roastedCoffees[0]).toEqual({
    uuid: getUpdatedRoastedCoffeeProps().uuid,
    name: getUpdatedRoastedCoffeeProps().name,
    greenCoffeeUuid: getUpdatedRoastedCoffeeProps().greenCoffeeUuid,
  });
});

test('should assign product variation to roasted coffee', async ({
  request,
}) => {
  await cleanUpData();

  await addGreenCoffee(request, getNewGreenCoffeeProps());
  await addRoastedCoffee(request, getNewRoastedCoffeeProps());
  const success = await assignProductVariation(
    request,
    getAssignProductVariationProps()
  );

  expect(success).toBe(200);

  const result = await getRoastingSettings(request);

  expect(result.productVariations).toHaveLength(1);
  expect(result.productVariations[0]).toEqual({
    id: getAssignProductVariationProps().id,
    weight: getAssignProductVariationProps().weight,
    roastedCoffeeUuid: getAssignProductVariationProps().roastedCoffeeUuid,
  });
});
