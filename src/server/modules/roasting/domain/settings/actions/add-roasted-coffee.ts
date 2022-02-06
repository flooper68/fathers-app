import moment from 'moment';

import { RoastingSettingsDomainEventCreators } from '../roasting-settings-events';
import { RoastingSettingsDomainAction } from '../roasting-settings-types';
import { RoastedCoffeeAlreadyExists } from '../roasting-settings-errors';
import { GreenCoffeeDoesNotExist } from './../roasting-settings-errors';

interface Props {
  uuid: string;
  name: string;
  greenCoffeeUuid: string;
}

export const addRoastedCoffeeAction: RoastingSettingsDomainAction<Props> = (
  props,
  context
): void => {
  const state = context.getState();

  if (state.roastedCoffees.find((coffee) => coffee.uuid === props.uuid)) {
    throw new RoastedCoffeeAlreadyExists();
  }

  if (
    !state.greenCoffees.find((coffee) => coffee.uuid === props.greenCoffeeUuid)
  ) {
    throw new GreenCoffeeDoesNotExist();
  }

  context.dispatch(
    RoastingSettingsDomainEventCreators.RoastedCoffeeAdded({
      uuid: props.uuid,
      name: props.name,
      greenCoffeeUuid: props.greenCoffeeUuid,
      timestamp: moment().format(),
    })
  );
};
