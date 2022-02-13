import { test, expect } from '@playwright/test';

import { cleanUpData } from '../../support/clean-data';
import { createRoasting } from '../../integration/roasting-client';
import {
  getNewGreenCoffeeProps,
  getNewRoastedCoffeeProps,
} from '../../fixtures/settings';
import {
  addGreenCoffee,
  addRoastedCoffee,
} from '../../integration/roasting-settings-client';
import { createRoastingProps } from '../../fixtures/roasting';

test('should create a new roasting', async ({ request }) => {
  await cleanUpData();

  await addGreenCoffee(request, getNewGreenCoffeeProps());
  await addRoastedCoffee(request, getNewRoastedCoffeeProps());

  const success = await createRoasting(request, createRoastingProps());

  expect(success).toBe(200);
});
