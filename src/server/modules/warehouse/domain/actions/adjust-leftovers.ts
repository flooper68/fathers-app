import { WarehouseRoastedCoffeeDomainEventCreators } from '../warehouse-roasted-coffee-events';
import { WarehouseRoastedCoffeeDomainAction } from '../warehouse-roasted-coffee-types';

interface Props {
  newAmount: number;
  timestamp: string;
}

export const adjustLeftoversAction: WarehouseRoastedCoffeeDomainAction<
  Props
> = (props, context): void => {
  const state = context.getState();

  context.dispatch(
    WarehouseRoastedCoffeeDomainEventCreators.RoastingLeftoversAdjusted({
      roastedCoffeeId: state.uuid,
      newAmount: props.newAmount,
      timestamp: props.timestamp,
    })
  );
};
