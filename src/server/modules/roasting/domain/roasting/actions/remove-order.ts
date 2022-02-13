import moment from 'moment';

import { RoastingDomainAction, RoastingStatus } from '../roasting-types';
import { RoastingDomainEventCreators } from '../roasting-events';
import {
  RoastingNotInPlanning,
  RoastingOrderDoesNotExist,
} from '../roasting-errors';

interface Props {
  id: number;
}

export const removeOrderAction: RoastingDomainAction<Props> = (
  props,
  context
): void => {
  const state = context.getState();

  if (state.status !== RoastingStatus.IN_PLANNING) {
    throw new RoastingNotInPlanning();
  }

  if (!state.orders.find((item) => item.id === props.id)) {
    throw new RoastingOrderDoesNotExist();
  }

  context.dispatch(
    RoastingDomainEventCreators.OrderRemoved({
      id: props.id,
      timestamp: moment().format(),
    })
  );
};
