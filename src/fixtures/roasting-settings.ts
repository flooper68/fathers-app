import { DeepPartial } from '@reduxjs/toolkit';
import { merge } from 'lodash';

import {
  RoastingGreenCoffee,
  RoastingProductVariation,
  RoastingRoastedCoffee,
  RoastingSettingsState,
} from '../server/modules/roasting/domain/settings/roasting-settings-types';

export const DEFAULT_ROASTING_SETTINGS_UUID = 'settings-uuid';
export const DEFAULT_ROASTED_COFFEE_UUID = 'roasted-coffee-uuid';
export const DEFAULT_GREEN_COFFEE_UUID = 'green-coffee-uuid';
export const DEFAULT_PRODUCT_VARIATION_ID = 1;

const getProductVariationTemplate = (): RoastingProductVariation => ({
  id: DEFAULT_PRODUCT_VARIATION_ID,
  weight: 10,
  roastedCoffeeUuid: DEFAULT_ROASTED_COFFEE_UUID,
});

const getGreenCoffeeTemplate = (): RoastingGreenCoffee => ({
  uuid: DEFAULT_GREEN_COFFEE_UUID,
  name: 'Kava',
  batchWeight: 10,
  roastingLossFactor: 0.9,
});

const getRoastedCoffeeTemplate = (): RoastingRoastedCoffee => ({
  uuid: DEFAULT_ROASTED_COFFEE_UUID,
  name: 'Roasted coffee',
  greenCoffeeUuid: DEFAULT_GREEN_COFFEE_UUID,
});

export const getRoastingSettingsTemplate = (): RoastingSettingsState => ({
  uuid: DEFAULT_ROASTING_SETTINGS_UUID,
  greenCoffees: [],
  roastedCoffees: [],
  productVariations: [],
});

const getProductVariationFixture = (
  partial: DeepPartial<RoastingProductVariation> = {}
): RoastingProductVariation => {
  return merge({}, getProductVariationTemplate(), partial);
};

const getGreenCoffeeFixture = (
  partial: DeepPartial<RoastingGreenCoffee> = {}
): RoastingGreenCoffee => {
  return merge({}, getGreenCoffeeTemplate(), partial);
};

const getRoastedCoffeeFixture = (
  partial: DeepPartial<RoastingRoastedCoffee> = {}
): RoastingRoastedCoffee => {
  return merge({}, getRoastedCoffeeTemplate(), partial);
};

export const getRoastingSettingsFixture = (
  partial: DeepPartial<RoastingSettingsState> = {}
): RoastingSettingsState => {
  const state = merge({}, getRoastingSettingsTemplate(), partial);

  state.greenCoffees =
    partial?.greenCoffees?.map((item) => getGreenCoffeeFixture(item)) || [];

  state.roastedCoffees =
    partial?.roastedCoffees?.map((item) => getRoastedCoffeeFixture(item)) || [];

  state.productVariations =
    partial?.productVariations?.map((item) =>
      getProductVariationFixture(item)
    ) || [];

  return state;
};
