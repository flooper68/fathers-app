import { getRoastingSettingsFixture } from '../../../../../../../fixtures/roasting-settings';
import { assertType } from '../../../../../common/assert-existence';
import {
  getLineItemRoastingPlan,
  isRoastinPlanGuard,
} from './get-line-item-roasting-plan';

const getSettings = () =>
  getRoastingSettingsFixture({
    productVariations: [
      {
        id: 1,
        weight: 10,
        roastedCoffeeUuid: 'roasted-coffee-uuid',
      },
    ],
    roastedCoffees: [
      {
        uuid: 'roasted-coffee-uuid',
        name: 'Roasted coffee',
        greenCoffeeUuid: 'green-coffee-uuid',
      },
      {
        uuid: 'other-roasted-coffee-uuid',
        name: 'Roasted coffee 2',
        greenCoffeeUuid: 'other-coffee-uuid',
      },
    ],
    greenCoffees: [
      {
        uuid: 'green-coffee-uuid',
        name: 'Green coffee',
        batchWeight: 10,
        roastingLossFactor: 0.5,
      },
      {
        uuid: 'other-coffee-uuid',
        name: 'Green coffee 2',
        batchWeight: 3,
        roastingLossFactor: 0.1,
      },
    ],
  });

describe('getLineItem', () => {
  it('returns empty state if the product veration is not set up', () => {
    const lineItem = {
      variationId: 2,
      quantity: 1,
    };

    const settings = getSettings();

    const roastingPlan = getLineItemRoastingPlan(lineItem, settings);

    expect(roastingPlan).toEqual({
      roasted: false,
    });
  });

  it('returns roasted flag set to true if line item is planned for roasting', () => {
    const lineItem = {
      variationId: 1,
      quantity: 1,
    };

    const settings = getSettings();

    const roastingPlan = getLineItemRoastingPlan(lineItem, settings);

    expect(roastingPlan.roasted).toEqual(true);
  });

  it('calculates ordered weight correctly', () => {
    const lineItem = {
      variationId: 1,
      quantity: 3,
    };

    const settings = getSettings();

    const value = getLineItemRoastingPlan(lineItem, settings);

    const roastingPlan = assertType(isRoastinPlanGuard)(value);

    expect(roastingPlan.orderedWeight).toEqual(30);
  });

  it('calculates needed green coffee weight correctly', () => {
    const lineItem = {
      variationId: 1,
      quantity: 3,
    };

    const settings = getSettings();

    const value = getLineItemRoastingPlan(lineItem, settings);

    const roastingPlan = assertType(isRoastinPlanGuard)(value);

    expect(roastingPlan.neededGreenCoffee).toEqual(60);
  });

  it('returns correct green coffee', () => {
    const lineItem = {
      variationId: 1,
      quantity: 3,
    };

    const settings = getSettings();

    const value = getLineItemRoastingPlan(lineItem, settings);

    const roastingPlan = assertType(isRoastinPlanGuard)(value);

    expect(roastingPlan.greenCoffeeUuid).toEqual('green-coffee-uuid');
  });

  it('returns correct roasted coffee', () => {
    const lineItem = {
      variationId: 1,
      quantity: 3,
    };

    const settings = getSettings();

    const value = getLineItemRoastingPlan(lineItem, settings);

    const roastingPlan = assertType(isRoastinPlanGuard)(value);

    expect(roastingPlan.roastedCoffeeUuid).toEqual('roasted-coffee-uuid');
  });

  it('returns correct number of batches', () => {
    const lineItem = {
      variationId: 1,
      quantity: 2,
    };

    const settings = getSettings();

    const value = getLineItemRoastingPlan(lineItem, settings);

    const roastingPlan = assertType(isRoastinPlanGuard)(value);

    expect(roastingPlan.numberOfBatchesNeeded).toEqual(4);
  });
});
