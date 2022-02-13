import moment from 'moment';

import { RoastingDomainAction, RoastingStatus } from '../roasting-types';
import { RoastingDomainEventCreators } from '../roasting-events';
import {
  BatchesAreNotAllRoasted,
  RoastingNotInProgress,
} from '../roasting-errors';
import { assertExistence } from './../../../../common/assert-existence';

interface Props {
  roastedCoffeeUuid: string;
  weight: number;
}

export const reportRealYieldAction: RoastingDomainAction<Props> = (
  props,
  context
): void => {
  const state = context.getState();

  if (state.status !== RoastingStatus.IN_PROGRESS) {
    throw new RoastingNotInProgress();
  }

  const plan = assertExistence(state.roastingPlan);

  const roastedCoffeeBatches = state.finishedBatches.find(
    (item) => item.roastedCoffeeUuid === props.roastedCoffeeUuid
  );

  if (
    plan.roastedCoffees[props.roastedCoffeeUuid].batchesToBeRoasted !==
    roastedCoffeeBatches?.amount
  ) {
    throw new BatchesAreNotAllRoasted();
  }

  context.dispatch(
    RoastingDomainEventCreators.YieldReported({
      roastedCoffeeUuid: props.roastedCoffeeUuid,
      weight: props.weight,
      timestamp: moment().format(),
    })
  );
};
