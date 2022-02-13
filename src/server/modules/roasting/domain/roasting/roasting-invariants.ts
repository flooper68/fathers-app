import {
  AllBatchesAreNotFinished,
  AllYieldsAreNotReported,
  RoastingInPlanningHasFinishedBatches,
  RoastingInPlanningHasReportedYields,
  RoastingInPlanningHasRoastinPlan,
  RoastingDoesNotHaveRoastinPlan,
  RoastingLineItemDoesNotBelongToOrder,
} from './roasting-errors';
import {
  RoastingState,
  RoastingLineItem,
  RoastingStatus,
} from './roasting-types';

const buildCheckLineItemsInvariants =
  (state: RoastingState) => (item: RoastingLineItem) => {
    if (!state.orders.find((order) => order.id === item.orderId)) {
      throw new RoastingLineItemDoesNotBelongToOrder();
    }
  };

const checkInPlanningRoasting = (state: RoastingState) => {
  if (state.finishedBatches.length !== 0) {
    throw new RoastingInPlanningHasFinishedBatches();
  }

  if (state.reportedYields.length !== 0) {
    throw new RoastingInPlanningHasReportedYields();
  }

  if (state.roastingPlan) {
    throw new RoastingInPlanningHasRoastinPlan();
  }
};

const checkInProgressRoasting = (state: RoastingState) => {
  if (!state.roastingPlan) {
    throw new RoastingDoesNotHaveRoastinPlan();
  }
};

const checkFinishedRoasting = (state: RoastingState) => {
  if (!state.roastingPlan) {
    throw new RoastingDoesNotHaveRoastinPlan();
  }

  Object.keys(state.roastingPlan.roastedCoffees).forEach((coffeeUuid) => {
    const batchesToBeRoasted =
      state.roastingPlan?.roastedCoffees[coffeeUuid].batchesToBeRoasted;

    if (batchesToBeRoasted === 0) {
      return;
    }

    const finishedBatch = state.finishedBatches.find(
      (item) => item.roastedCoffeeUuid === coffeeUuid
    );

    if (finishedBatch?.amount !== batchesToBeRoasted) {
      throw new AllBatchesAreNotFinished();
    }

    const reportedYield = state.reportedYields.find(
      (item) => item.roastedCoffeeUuid === coffeeUuid
    );

    if (!reportedYield) {
      throw new AllYieldsAreNotReported();
    }
  });
};

export const checkRoastingInvariants = (state: RoastingState): void => {
  state.lineItems.forEach(buildCheckLineItemsInvariants(state));

  if (state.status === RoastingStatus.IN_PLANNING) {
    checkInPlanningRoasting(state);
  }

  if (state.status === RoastingStatus.IN_PROGRESS) {
    checkInProgressRoasting(state);
  }

  if (state.status === RoastingStatus.FINISHED) {
    checkFinishedRoasting(state);
  }
};
