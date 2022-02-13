import { assertExistence } from './../../../../../common/assert-existence';
import { getLineItemRoastingPlan } from './get-line-item-roasting-plan';
import { RoastingState } from './../../roasting-types';

interface GreenCoffeePlan {
  weight: number;
}

interface RoastedCoffeePlan {
  expectedWeight: number;
  orderedWeigth: number;
  batchesToBeRoasted: number;
}

export interface RoastingPlan {
  greenCoffees: Record<string, GreenCoffeePlan>;
  roastedCoffees: Record<string, RoastedCoffeePlan>;
}

export const getRoastingPlan = (
  state: RoastingState,
  getLineItemPlan: typeof getLineItemRoastingPlan
): RoastingPlan => {
  const allGreenCoffess: Record<string, GreenCoffeePlan> =
    state.settings.greenCoffees.reduce((memo, item) => {
      memo[item.uuid] = {
        weight: 0,
      };
      return memo;
    }, {} as Record<string, GreenCoffeePlan>);

  const allRoastedCoffess: Record<string, RoastedCoffeePlan> =
    state.settings.roastedCoffees.reduce((memo, item) => {
      memo[item.uuid] = {
        expectedWeight: 0,
        orderedWeigth: 0,
        batchesToBeRoasted: 0,
      };
      return memo;
    }, {} as Record<string, RoastedCoffeePlan>);

  const initialValues: RoastingPlan = {
    greenCoffees: allGreenCoffess,
    roastedCoffees: allRoastedCoffess,
  };

  const reducedLineItems = state.lineItems.reduce((memo, item) => {
    const itemPlan = getLineItemPlan(item, state.settings);

    if (!itemPlan.roasted) {
      return memo;
    }

    memo.greenCoffees[itemPlan.greenCoffeeUuid].weight =
      memo.greenCoffees[itemPlan.greenCoffeeUuid].weight +
      itemPlan.neededGreenCoffee;

    memo.roastedCoffees[itemPlan.roastedCoffeeUuid].batchesToBeRoasted =
      memo.roastedCoffees[itemPlan.roastedCoffeeUuid].batchesToBeRoasted +
      itemPlan.numberOfBatchesNeeded;

    memo.roastedCoffees[itemPlan.roastedCoffeeUuid].orderedWeigth =
      memo.roastedCoffees[itemPlan.roastedCoffeeUuid].orderedWeigth +
      itemPlan.orderedWeight;

    return memo;
  }, initialValues);

  const greenCoffeeWithEstimation: Record<string, GreenCoffeePlan> =
    Object.keys(allGreenCoffess).reduce((memo, item) => {
      const reducedItem = reducedLineItems.greenCoffees[item];

      memo[item] = {
        weight: reducedItem.weight,
      };

      return memo;
    }, allGreenCoffess);

  const roastedCoffeeWithEstimation: Record<string, RoastedCoffeePlan> =
    Object.keys(allRoastedCoffess).reduce((memo, uuid) => {
      const reducedItem = reducedLineItems.roastedCoffees[uuid];
      const greenCoffeeUuid = assertExistence(
        state.settings.roastedCoffees.find((item) => item.uuid === uuid)
      ).greenCoffeeUuid;
      const greenCoffee = assertExistence(
        state.settings.greenCoffees.find(
          (item) => item.uuid === greenCoffeeUuid
        )
      );

      memo[uuid] = {
        batchesToBeRoasted: Math.ceil(reducedItem.batchesToBeRoasted),
        expectedWeight:
          reducedItem.batchesToBeRoasted *
          greenCoffee.batchWeight *
          greenCoffee.roastingLossFactor,
        orderedWeigth: reducedItem.orderedWeigth,
      };

      return memo;
    }, allRoastedCoffess);

  return {
    roastedCoffees: roastedCoffeeWithEstimation,
    greenCoffees: greenCoffeeWithEstimation,
  };
};
