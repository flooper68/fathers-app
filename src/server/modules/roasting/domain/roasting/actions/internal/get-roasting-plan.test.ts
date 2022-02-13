import { getRoastingFixture } from './../../../../../../../fixtures/roasting';
import { getLineItemRoastingPlan } from './get-line-item-roasting-plan';
import { getRoastingPlan } from './get-roasting-plan';

const greenCoffeeUuid = 'green-coffee-uuid';
const roastedCoffeeUuid = 'roasted-coffee-uuid';

const getSettings = () => ({
  productVariations: [
    {
      id: 1,
      weight: 3,
      roastedCoffeeUuid: roastedCoffeeUuid,
    },
  ],
  roastedCoffees: [
    {
      uuid: roastedCoffeeUuid,
      name: 'Roasted coffee',
      greenCoffeeUuid: greenCoffeeUuid,
    },
    {
      uuid: 'other-roasted-coffee-uuid',
      name: 'Roasted coffee 2',
      greenCoffeeUuid: 'other-coffee-uuid',
    },
  ],
  greenCoffees: [
    {
      uuid: greenCoffeeUuid,
      name: 'Green coffee',
      batchWeight: 10,
      roastingLossFactor: 0.9,
    },
    {
      uuid: 'other-coffee-uuid',
      name: 'Green coffee 2',
      batchWeight: 3,
      roastingLossFactor: 0.1,
    },
  ],
});

describe('getRoastingPlan', () => {
  it('calculates roasted coffee batches correctly', () => {
    const lineItem = {
      variationId: 1,
      quantity: 3,
    };

    const state = getRoastingFixture({
      settings: getSettings(),
      lineItems: [lineItem],
    });

    const roastingPlan = getRoastingPlan(state, getLineItemRoastingPlan);

    expect(
      roastingPlan.roastedCoffees[roastedCoffeeUuid].batchesToBeRoasted
    ).toEqual(1);
  });

  it('calculates green coffee weight correctly', () => {
    const lineItem = {
      variationId: 1,
      quantity: 3,
    };

    const state = getRoastingFixture({
      settings: getSettings(),
      lineItems: [lineItem],
    });

    const roastingPlan = getRoastingPlan(state, getLineItemRoastingPlan);

    expect(roastingPlan.greenCoffees[greenCoffeeUuid].weight).toEqual(10);
  });

  it('calculates expected roasted coffee weight correctly', () => {
    const lineItem = {
      variationId: 1,
      quantity: 3,
    };

    const state = getRoastingFixture({
      settings: getSettings(),
      lineItems: [lineItem],
    });

    const roastingPlan = getRoastingPlan(state, getLineItemRoastingPlan);

    expect(
      roastingPlan.roastedCoffees[roastedCoffeeUuid].expectedWeight
    ).toEqual(9);
  });

  it('calculates ordered roasted coffee weight correctly', () => {
    const lineItem = {
      variationId: 1,
      quantity: 3,
    };

    const state = getRoastingFixture({
      settings: getSettings(),
      lineItems: [lineItem],
    });

    const roastingPlan = getRoastingPlan(state, getLineItemRoastingPlan);

    expect(
      roastingPlan.roastedCoffees[roastedCoffeeUuid].orderedWeigth
    ).toEqual(9);
  });
});
