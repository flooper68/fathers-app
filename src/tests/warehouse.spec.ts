import { test, expect } from '@playwright/test';
import moment from 'moment';
import { v4 } from 'uuid';

import {
  addWarehouseRoastedCoffees,
  adjustWarehouseRoastedCoffees,
  getWarehouseRoastedCoffees,
  useWarehouseRoastedCoffees,
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

  await useWarehouseRoastedCoffees(request, {
    roastedCoffeeId: 'coffee',
    amount: 3,
    timestamp: moment().format(),
    correlationUuid: v4(),
  });

  await new Promise((res) => setTimeout(res, 200));
  const result2 = await getWarehouseRoastedCoffees(request);

  expect(result2.length).toBe(1);
  expect(result2[0].quantityOnHand).toBe(7);

  await adjustWarehouseRoastedCoffees(request, {
    roastedCoffeeId: 'coffee',
    newAmount: 3,
    timestamp: moment().format(),
    correlationUuid: v4(),
  });

  await new Promise((res) => setTimeout(res, 200));
  const result3 = await getWarehouseRoastedCoffees(request);

  expect(result3.length).toBe(1);
  expect(result3[0].quantityOnHand).toBe(3);
});
