import moment from 'moment';

import { RoastingDomainAction, RoastingStatus } from '../roasting-types';
import { RoastingDomainEventCreators } from '../roasting-events';
import {
  AllBatchesAreNotFinished,
  RoastingNotInProgress,
} from '../roasting-errors';
import { assertExistence } from './../../../../common/assert-existence';
import { AllYieldsAreNotReported } from './../roasting-errors';

export const finishRoastingAction: RoastingDomainAction<void> = (
  props,
  context
): void => {
  const state = context.getState();

  if (state.status !== RoastingStatus.IN_PROGRESS) {
    throw new RoastingNotInProgress();
  }

  const plan = assertExistence(state.roastingPlan);

  Object.keys(plan.roastedCoffees).forEach((coffeeUuid) => {
    const batchesToBeRoasted =
      plan.roastedCoffees[coffeeUuid].batchesToBeRoasted;

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

  context.dispatch(
    RoastingDomainEventCreators.RoastingFinished({
      timestamp: moment().format(),
    })
  );
};
