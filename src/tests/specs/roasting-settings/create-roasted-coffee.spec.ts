import { test, expect } from '@playwright/test';

import {
  getNewGreenCoffeeProps,
  getNewRoastedCoffeeProps,
} from '../../fixtures/settings';
import {
  addGreenCoffee,
  addRoastedCoffee,
  getRoastingSettings,
} from '../../integration/roasting-settings-client';
import { cleanUpData } from '../../support/clean-data';

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
