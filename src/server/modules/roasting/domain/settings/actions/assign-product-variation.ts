import moment from 'moment';

import { RoastedCoffeeDoesNotExist } from '../roasting-settings-errors';
import { RoastingSettingsDomainEventCreators } from '../roasting-settings-events';
import { RoastingSettingsDomainAction } from '../roasting-settings-types';

interface Props {
  id: number;
  weight: number;
  roastedCoffeeUuid: string;
}

export const assignProductVariationAction: RoastingSettingsDomainAction<
  Props
> = (props, context): void => {
  const state = context.getState();

  if (
    !state.roastedCoffees.find(
      (coffee) => coffee.uuid === props.roastedCoffeeUuid
    )
  ) {
    throw new RoastedCoffeeDoesNotExist();
  }

  context.dispatch(
    RoastingSettingsDomainEventCreators.ProductVariationAssigned({
      id: props.id,
      weight: props.weight,
      roastedCoffeeUuid: props.roastedCoffeeUuid,
      timestamp: moment().format(),
    })
  );
};
