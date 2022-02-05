import { test, expect } from '@playwright/test';
import moment from 'moment';
import { v4 } from 'uuid';

import {
  addWarehouseRoastedCoffees,
  getWarehouseRoastedCoffees,
} from './integration/warehouse-client';
import { cleanUpData } from './support/clean-data';

test('basic test', async ({ request }) => {
  await cleanUpData();

  await addWarehouseRoastedCoffees(request, {
    roastingId: 'roasting',
    roastedCoffeeId: 'coffee',
    amount: 10,
    timestamp: moment().format(),
    correlationUuid: v4(),
  });

  await new Promise((res) => setTimeout(res, 200));
  const result = await getWarehouseRoastedCoffees(request);

  expect(result.length).toBe(1);
  expect(result[0].quantityOnHand).toBe(10);
});
