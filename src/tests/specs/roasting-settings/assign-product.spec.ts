import { test, expect } from '@playwright/test';

import {
  getNewGreenCoffeeProps,
  getNewRoastedCoffeeProps,
  getAssignProductVariationProps,
} from '../../fixtures/settings';
import {
  addGreenCoffee,
  addRoastedCoffee,
  assignProductVariation,
  getRoastingSettings,
} from '../../integration/roasting-settings-client';
import { cleanUpData } from '../../support/clean-data';

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
