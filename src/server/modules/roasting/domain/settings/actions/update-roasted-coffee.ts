import moment from 'moment';

import {
  GreenCoffeeDoesNotExist,
  RoastedCoffeeDoesNotExist,
} from '../roasting-settings-errors';
import { RoastingSettingsDomainEventCreators } from '../roasting-settings-events';
import { RoastingSettingsDomainAction } from '../roasting-settings-types';

interface Props {
  uuid: string;
  name: string;
  greenCoffeeUuid: string;
}

export const updateRoastedCoffeeAction: RoastingSettingsDomainAction<Props> = (
  props,
  context
): void => {
  const state = context.getState();

  if (!state.roastedCoffees.find((coffee) => coffee.uuid === props.uuid)) {
    throw new RoastedCoffeeDoesNotExist();
  }

  if (
    !state.greenCoffees.find((coffee) => coffee.uuid === props.greenCoffeeUuid)
  ) {
    throw new GreenCoffeeDoesNotExist();
  }

  context.dispatch(
    RoastingSettingsDomainEventCreators.RoastedCoffeeUpdated({
      uuid: props.uuid,
      name: props.name,
      greenCoffeeUuid: props.greenCoffeeUuid,
      timestamp: moment().format(),
    })
  );
};
