import moment from 'moment';

import { GreenCoffeeDoesNotExist } from './../roasting-settings-errors';
import { RoastingSettingsDomainEventCreators } from './../roasting-settings-events';
import { RoastingSettingsDomainAction } from '../roasting-settings-types';

interface Props {
  uuid: string;
  name: string;
  batchWeight: number;
  roastingLossFactor: number;
}

export const updateGreenCoffeeAction: RoastingSettingsDomainAction<Props> = (
  props,
  context
): void => {
  const state = context.getState();

  if (!state.greenCoffees.find((coffee) => coffee.uuid === props.uuid)) {
    throw new GreenCoffeeDoesNotExist();
  }

  context.dispatch(
    RoastingSettingsDomainEventCreators.GreenCoffeeUpdated({
      uuid: props.uuid,
      name: props.name,
      batchWeight: props.batchWeight,
      roastingLossFactor: props.roastingLossFactor,
      timestamp: moment().format(),
    })
  );
};
