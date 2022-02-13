import moment from 'moment';

import { RoastingDomainAction, RoastingStatus } from '../roasting-types';
import { RoastingDomainEventCreators } from '../roasting-events';
import {
  AllBatchesAlreadyFinished,
  RoastingNotInProgress,
} from '../roasting-errors';
import { assertExistence } from './../../../../common/assert-existence';

interface Props {
  roastedCoffeeUuid: string;
}

export const finishBatchAction: RoastingDomainAction<Props> = (
  props,
  context
): void => {
  const state = context.getState();

  if (state.status !== RoastingStatus.IN_PROGRESS) {
    throw new RoastingNotInProgress();
  }

  const roastedCoffeeBatches = state.finishedBatches.find(
    (item) => item.roastedCoffeeUuid === props.roastedCoffeeUuid
  );

  if (
    assertExistence(state.roastingPlan).roastedCoffees[props.roastedCoffeeUuid]
      .batchesToBeRoasted === roastedCoffeeBatches?.amount
  ) {
    throw new AllBatchesAlreadyFinished();
  }

  context.dispatch(
    RoastingDomainEventCreators.BatchFinished({
      roastedCoffeeUuid: props.roastedCoffeeUuid,
      timestamp: moment().format(),
    })
  );
};
