import { getRoastingSettingsFixture } from '../../../../../fixtures/roasting-settings';
import {
  GreenCoffeeInvalidBatchWeight,
  GreenCoffeeInvalidLossFactor,
  NegativeProductVariationWeight,
  RoastedCoffeeBelongsToUnknownEntity,
} from './roasting-settings-errors';
import { checkRoastingSettingsInvariants } from './roasting-settings-invariants';

describe('checkRoastingSettingsInvariants', () => {
  it('fails if green coffee roastingLossFactor is bigger than 1', () => {
    const state = getRoastingSettingsFixture({
      greenCoffees: [
        {
          roastingLossFactor: 1.1,
        },
      ],
    });

    expect(() => checkRoastingSettingsInvariants(state)).toThrow(
      GreenCoffeeInvalidLossFactor
    );
  });

  it('fails if green coffee roastingLossFactor is smaller than 0', () => {
    const state = getRoastingSettingsFixture({
      greenCoffees: [
        {
          roastingLossFactor: -0.1,
        },
      ],
    });

    expect(() => checkRoastingSettingsInvariants(state)).toThrow(
      GreenCoffeeInvalidLossFactor
    );
  });

  it('fails if green coffee batchWeight is smaller than 0', () => {
    const state = getRoastingSettingsFixture({
      greenCoffees: [
        {
          batchWeight: -0.1,
        },
      ],
    });

    expect(() => checkRoastingSettingsInvariants(state)).toThrow(
      GreenCoffeeInvalidBatchWeight
    );
  });

  it('fails if roated coffee belongs to non-existent entity', () => {
    const state = getRoastingSettingsFixture({
      roastedCoffees: [{ greenCoffeeUuid: 'non-existent' }],
    });

    expect(() => checkRoastingSettingsInvariants(state)).toThrow(
      RoastedCoffeeBelongsToUnknownEntity
    );
  });

  it('fails if ProductVariation has negative weight', () => {
    const state = getRoastingSettingsFixture({
      greenCoffees: [{}],
      roastedCoffees: [{}],
      productVariations: [{ weight: -10 }],
    });

    expect(() => checkRoastingSettingsInvariants(state)).toThrow(
      NegativeProductVariationWeight
    );
  });

  it('fails if ProductVariation has 0 weight', () => {
    const state = getRoastingSettingsFixture({
      greenCoffees: [{}],
      roastedCoffees: [{}],
      productVariations: [{ weight: 0 }],
    });

    expect(() => checkRoastingSettingsInvariants(state)).toThrow(
      NegativeProductVariationWeight
    );
  });
});
