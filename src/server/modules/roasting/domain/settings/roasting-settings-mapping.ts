import {
  RoastingGreenCoffee,
  RoastingProductVariation,
  RoastingRoastedCoffee,
  RoastingSettingsNormalizedState,
  RoastingSettingsState,
} from './roasting-settings-types';

const normalizeState = (
  state: RoastingSettingsState
): RoastingSettingsNormalizedState => {
  const greenCoffees = state.greenCoffees.reduce<
    Record<string, RoastingGreenCoffee>
  >((memo, item) => {
    memo[item.uuid] = item;
    return memo;
  }, {});

  const roastedCoffees = state.roastedCoffees.reduce<
    Record<string, RoastingRoastedCoffee>
  >((memo, item) => {
    memo[item.uuid] = item;
    return memo;
  }, {});

  const productVariations = state.productVariations.reduce<
    Record<string, RoastingProductVariation>
  >((memo, item) => {
    memo[item.id] = item;
    return memo;
  }, {});

  return {
    uuid: state.uuid,
    greenCoffees,
    roastedCoffees,
    productVariations,
  };
};

const denormalizeState = (
  state: RoastingSettingsNormalizedState
): RoastingSettingsState => {
  return {
    uuid: state.uuid,
    greenCoffees: Object.values(state.greenCoffees),
    roastedCoffees: Object.values(state.roastedCoffees),
    productVariations: Object.values(state.productVariations),
  };
};

export const RoastingSettingsMapping = {
  normalizeState,
  denormalizeState,
};
