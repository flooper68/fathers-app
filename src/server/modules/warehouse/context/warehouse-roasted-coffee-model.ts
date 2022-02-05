import { Schema, model } from 'mongoose';

import { AggregateRootDocument } from '../../common/aggreagte-root-store';
import { WarehouseRoastedCoffeeDomainEvent } from '../domain/warehouse-roasted-coffee-events';
import { WarehouseRoastedCoffeeState } from '../domain/warehouse-roasted-coffee-types';

export type WarehouseRoastedCoffeeDocument = AggregateRootDocument<
  WarehouseRoastedCoffeeState,
  WarehouseRoastedCoffeeDomainEvent
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
export const warehouseRoastedCoffeeModel =
  model<WarehouseRoastedCoffeeDocument>('warehouse-roasted-coffee-new', schema);

export type WarehouseRoastedCoffeeModel = typeof warehouseRoastedCoffeeModel;
