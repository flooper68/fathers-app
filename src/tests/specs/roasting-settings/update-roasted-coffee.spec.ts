import { test, expect } from '@playwright/test';

import {
  getNewGreenCoffeeProps,
  getNewRoastedCoffeeProps,
  getUpdatedRoastedCoffeeProps,
} from '../../fixtures/settings';
import {
  addGreenCoffee,
  addRoastedCoffee,
  updateRoastedCoffee,
  getRoastingSettings,
} from '../../integration/roasting-settings-client';
import { cleanUpData } from '../../support/clean-data';

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
