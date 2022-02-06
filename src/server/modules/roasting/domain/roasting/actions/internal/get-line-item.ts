import { assertExistence } from '../../../../../common/assert-existence';
import { RoastingSettingsState } from '../../../settings/roasting-settings-types';

export const getLineItemRoasting = (
  lineItem: {
    variationId: number;
    quantity: number;
  },
  settings: RoastingSettingsState
) => {
  const variation = settings.productVariations.find(
    (item) => item.id === lineItem.variationId
  );

  if (!variation) {
    return {
      roasted: false,
      orderedWeight: 0,
      neededGreenCoffee: 0,
      numberOfBatchesNeeded: 0,
    };
  }

  const roastedCoffee = assertExistence(
    settings.roastedCoffees.find(
      (coffee) => coffee.uuid === variation?.roastedCoffeeUuid
    )
  );
  const greenCoffee = assertExistence(
    settings.greenCoffees.find(
      (coffee) => coffee.uuid === roastedCoffee?.greenCoffeeUuid
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
