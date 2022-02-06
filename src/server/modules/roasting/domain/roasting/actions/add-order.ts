import moment from 'moment';

import {
  RoastingDomainAction,
  RoastingLineItem,
  RoastingStatus,
} from './../roasting-types';
import { RoastingDomainEventCreators } from './../roasting-events';
import { RoastingNotInPlanning } from '../roasting-errors';

interface Props {
  id: number;
  lineItems: RoastingLineItem[];
}

export const addOrderAction: RoastingDomainAction<Props> = (
  props,
  context
): void => {
  const state = context.getState();

  if (state.status !== RoastingStatus.IN_PLANNING) {
    throw new RoastingNotInPlanning();
  }

  context.dispatch(
    RoastingDomainEventCreators.OrderAdded({
      id: props.id,
      lineItems: props.lineItems,
      timestamp: moment().format(),
    })
  );
};
