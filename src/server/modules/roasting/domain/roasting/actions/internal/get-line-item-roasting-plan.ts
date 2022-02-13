import { assertExistence } from '../../../../../common/assert-existence';
import { RoastingSettingsState } from '../../../settings/roasting-settings-types';

type NotRoasting = {
  roasted: false;
};

type RoastingPlan = {
  roasted: true;
  orderedWeight: number;
  neededGreenCoffee: number;
  numberOfBatchesNeeded: number;
  greenCoffeeUuid: string;
  roastedCoffeeUuid: string;
};

export const isRoastinPlanGuard = (
  plan: NotRoasting | RoastingPlan
): plan is RoastingPlan => {
  return plan.roasted;
};

export const getLineItemRoastingPlan = (
  lineItem: {
    variationId: number;
    quantity: number;
  },
  settings: RoastingSettingsState
): NotRoasting | RoastingPlan => {
  const variation = settings.productVariations.find(
    (item) => item.id === lineItem.variationId
  );

  if (!variation) {
    return {
      roasted: false,
    };
  }

  const roastedCoffee = assertExistence(
    settings.roastedCoffees.find(
      (coffee) => coffee.uuid === variation.roastedCoffeeUuid
    )
  );
  const greenCoffee = assertExistence(
    settings.greenCoffees.find(
      (coffee) => coffee.uuid === roastedCoffee.greenCoffeeUuid
    )
  );

  const orderedWeight = lineItem.quantity * variation.weight;
  const neededGreenCoffee = orderedWeight / greenCoffee.roastingLossFactor;
  const numberOfBatchesNeeded = neededGreenCoffee / greenCoffee.batchWeight;

  return {
    roasted: true,
    greenCoffeeUuid: greenCoffee.uuid,
    roastedCoffeeUuid: roastedCoffee.uuid,
    orderedWeight,
    neededGreenCoffee,
    numberOfBatchesNeeded,
  };
};
