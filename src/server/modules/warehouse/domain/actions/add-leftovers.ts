import { WarehouseRoastedCoffeeDomainEventCreators } from './../warehouse-roasted-coffee-events';
import { WarehouseRoastedCoffeeDomainAction } from './../warehouse-roasted-coffee-types';

interface Props {
  amount: number;
  roastingId: string;
  timestamp: string;
}

export const addLeftoversAction: WarehouseRoastedCoffeeDomainAction<Props> = (
  props,
  context
): void => {
  const state = context.getState();

  context.dispatch(
    WarehouseRoastedCoffeeDomainEventCreators.RoastingLeftoversAdded({
      roastedCoffeeId: state.uuid,
      roastingId: props.roastingId,
      amount: props.amount,
      timestamp: props.timestamp,
    })
  );
};
