import { test, expect } from '@playwright/test';

import { getNewGreenCoffeeProps } from '../../fixtures/settings';
import {
  addGreenCoffee,
  getRoastingSettings,
} from '../../integration/roasting-settings-client';
import { cleanUpData } from '../../support/clean-data';

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
