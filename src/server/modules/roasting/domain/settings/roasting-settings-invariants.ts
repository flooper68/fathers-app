import {
  GreenCoffeeInvalidBatchWeight,
  GreenCoffeeInvalidLossFactor,
  NegativeProductVariationWeight,
  RoastedCoffeeBelongsToUnknownEntity,
} from './roasting-settings-errors';
import {
  RoastingGreenCoffee,
  RoastingProductVariation,
  RoastingRoastedCoffee,
  RoastingSettingsState,
} from './roasting-settings-types';

const checkGreenCoffee = (coffee: RoastingGreenCoffee) => {
  if (coffee.batchWeight <= 0) {
    throw new GreenCoffeeInvalidBatchWeight();
  }

  if (coffee.roastingLossFactor < 0 || coffee.roastingLossFactor > 1) {
    throw new GreenCoffeeInvalidLossFactor();
  }
};

const buildCheckRoastedCoffee =
  (state: RoastingSettingsState) => (coffee: RoastingRoastedCoffee) => {
    if (
      !state.greenCoffees.find((item) => item.uuid === coffee.greenCoffeeUuid)
    ) {
      throw new RoastedCoffeeBelongsToUnknownEntity();
    }
  };

const checkProductVariation = (variation: RoastingProductVariation) => {
  if (variation.weight <= 0) {
    throw new NegativeProductVariationWeight();
  }
};

export const checkRoastingSettingsInvariants = (
  state: RoastingSettingsState
): void => {
  state.greenCoffees.forEach(checkGreenCoffee);
  state.roastedCoffees.map(buildCheckRoastedCoffee(state));
  state.productVariations.forEach(checkProductVariation);
};
