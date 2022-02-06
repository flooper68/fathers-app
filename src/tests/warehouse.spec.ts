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

const waitForProjectionTimeout = () =>
  new Promise((res) => setTimeout(res, 500));

test('should add roasted coffee to warehouse', async ({ request }) => {
  await cleanUpData();

  const success = await addWarehouseRoastedCoffees(request, {
    roastingId: 'roasting',
    roastedCoffeeId: 'coffee',
    amount: 10,
    timestamp: moment().format(),
    correlationUuid: v4(),
  });

  expect(success).toBe(200);

  await waitForProjectionTimeout();
  const result = await getWarehouseRoastedCoffees(request);

  expect(result.length).toBe(1);
  expect(result[0].quantityOnHand).toBe(10);
});

test('should use roasted coffee from warehouse', async ({ request }) => {
  await cleanUpData();

  await addWarehouseRoastedCoffees(request, {
    roastingId: 'roasting',
    roastedCoffeeId: 'coffee',
    amount: 10,
    timestamp: moment().format(),
    correlationUuid: v4(),
  });
  const success = await useWarehouseRoastedCoffees(request, {
    roastedCoffeeId: 'coffee',
    amount: 3,
    timestamp: moment().format(),
    correlationUuid: v4(),
  });

  expect(success).toBe(200);

  await waitForProjectionTimeout();

  const result = await getWarehouseRoastedCoffees(request);
  expect(result[0].quantityOnHand).toBe(7);
});

test('should adjust roasted coffee in warehouse', async ({ request }) => {
  await cleanUpData();

  await addWarehouseRoastedCoffees(request, {
    roastingId: 'roasting',
    roastedCoffeeId: 'coffee',
    amount: 10,
    timestamp: moment().format(),
    correlationUuid: v4(),
  });
  await useWarehouseRoastedCoffees(request, {
    roastedCoffeeId: 'coffee',
    amount: 3,
    timestamp: moment().format(),
    correlationUuid: v4(),
  });
  const success = await adjustWarehouseRoastedCoffees(request, {
    roastedCoffeeId: 'coffee',
    newAmount: 15,
    timestamp: moment().format(),
    correlationUuid: v4(),
  });

  expect(success).toBe(200);

  await waitForProjectionTimeout();

  const result = await getWarehouseRoastedCoffees(request);
  expect(result[0].quantityOnHand).toBe(15);
});
