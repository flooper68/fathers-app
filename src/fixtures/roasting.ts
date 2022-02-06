import { DeepPartial } from '@reduxjs/toolkit';
import { merge } from 'lodash';

import {
  RoastingState,
  RoastingStatus,
} from './../server/modules/roasting/domain/roasting/roasting-types';
import { getRoastingSettingsTemplate } from './roasting-settings';

export const DEFAULT_ROASTING_UUID = 'roasting-uuid';

const getTemplate = (): RoastingState => ({
  uuid: DEFAULT_ROASTING_UUID,
  roastingDate: 'today',
  status: RoastingStatus.IN_PLANNING,
  settings: getRoastingSettingsTemplate(),
  orders: [],
  lineItems: [],
  finishedBatches: [],
  realYield: [],
});

export const getRoastingFixture = (
  partial: DeepPartial<RoastingState> = {}
): RoastingState => {
  const state = merge({}, getTemplate(), partial);

  return state;
};
