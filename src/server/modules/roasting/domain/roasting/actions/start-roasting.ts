import moment from 'moment';

import { RoastingDomainAction, RoastingStatus } from '../roasting-types';
import { RoastingDomainEventCreators } from '../roasting-events';
import { RoastingNotInPlanning } from './../roasting-errors';

export const startRoastingAction: RoastingDomainAction<void> = (
  props,
  context
): void => {
  const state = context.getState();

  if (state.status !== RoastingStatus.IN_PLANNING) {
    throw new RoastingNotInPlanning();
  }

  context.dispatch(
    RoastingDomainEventCreators.RoastingStarted({
      roastingPlan: context.getRoastingPlan(
        state,
        context.getLineItemRoastingPlan
      ),
      timestamp: moment().format(),
    })
  );
};
