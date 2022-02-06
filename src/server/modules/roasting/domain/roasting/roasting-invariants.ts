import { RoastingLineItemDoesNotBelongToOrder } from './roasting-errors';
import { RoastingState, RoastingLineItem } from './roasting-types';

const buildCheckLineItemsInvariants =
  (state: RoastingState) => (item: RoastingLineItem) => {
    if (!state.orders.find((order) => order.id === item.orderId)) {
      throw new RoastingLineItemDoesNotBelongToOrder();
    }
  };

export const checkRoastingInvariants = (state: RoastingState): void => {
  state.lineItems.forEach(buildCheckLineItemsInvariants(state));
};
