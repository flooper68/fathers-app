import { WarehouseRoastedCoffeeDomainEventCreators } from '../warehouse-roasted-coffee-events';
import { WarehouseRoastedCoffeeDomainAction } from '../warehouse-roasted-coffee-types';

interface Props {
  amount: number;
  timestamp: string;
}

export const useLeftoversAction: WarehouseRoastedCoffeeDomainAction<Props> = (
  props,
  context
): void => {
  const state = context.getState();

  context.dispatch(
    WarehouseRoastedCoffeeDomainEventCreators.RoastingLeftoversUsed({
      roastedCoffeeId: state.uuid,
      amount: props.amount,
      timestamp: props.timestamp,
    })
  );
};
