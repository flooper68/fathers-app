import { Schema, model } from 'mongoose';

import { AggregateRootDocument } from '../../common/aggreagte-root-store';
import { RoastingSettingsDomainEvent } from '../domain/settings/roasting-settings-events';
import { RoastingSettingsState } from '../domain/settings/roasting-settings-types';

export type RoastingSettingsDocument = AggregateRootDocument<
  RoastingSettingsState,
  RoastingSettingsDomainEvent
>;

const schema = new Schema({
  _id: String,
  schemaVersion: {
    type: Number,
    required: true,
  },
  startEventPosition: Number,
  endEventPosition: Number,
  position: Number,
  dataVersion: Number,
  streams: [String],

  uuid: String,
  state: Object,
  events: [Object],
  outbox: [Object],
});

// TODO add to DI
export const roastingSettingsModel = model<RoastingSettingsDocument>(
  'roasting-settings-new',
  schema
);

export type RoastingSettingsModel = typeof roastingSettingsModel;
