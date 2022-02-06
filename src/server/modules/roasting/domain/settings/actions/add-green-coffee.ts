import moment from 'moment';

import { RoastingSettingsDomainEventCreators } from '../roasting-settings-events';
import { RoastingSettingsDomainAction } from '../roasting-settings-types';
import { GreenCoffeeAlreadyExists } from './../roasting-settings-errors';

interface Props {
  uuid: string;
  name: string;
  batchWeight: number;
  roastingLossFactor: number;
}

export const addGreenCoffeeAction: RoastingSettingsDomainAction<Props> = (
  props,
  context
): void => {
  const state = context.getState();

  if (state.greenCoffees.find((coffee) => coffee.uuid === props.uuid)) {
    throw new GreenCoffeeAlreadyExists();
  }

  context.dispatch(
    RoastingSettingsDomainEventCreators.GreenCoffeeAdded({
      uuid: props.uuid,
      name: props.name,
      batchWeight: props.batchWeight,
      roastingLossFactor: props.roastingLossFactor,
      timestamp: moment().format(),
    })
  );
};
