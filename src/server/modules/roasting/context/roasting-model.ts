import { Schema, model } from 'mongoose';

import { AggregateRootDocument } from '../../common/aggreagte-root-store';
import { RoastingDomainEvent } from './../domain/roasting/roasting-events';
import { RoastingState } from './../domain/roasting/roasting-types';

export type RoastingDocument = AggregateRootDocument<
  RoastingState,
  RoastingDomainEvent
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
export const roastingModel = model<RoastingDocument>('roasting--new', schema);

export type RoastingModel = typeof roastingModel;
