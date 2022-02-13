import { test, expect } from '@playwright/test';

import {
  getNewGreenCoffeeProps,
  getUpdateGreenCoffeeProps,
} from '../../fixtures/settings';
import {
  addGreenCoffee,
  updateGreenCoffee,
  getRoastingSettings,
} from '../../integration/roasting-settings-client';
import { cleanUpData } from '../../support/clean-data';

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
