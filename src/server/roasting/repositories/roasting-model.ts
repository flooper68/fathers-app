import { Schema, model, Document } from 'mongoose';

import { Roasting, RoastingStatus } from '../../../shared/types/roasting';

const ROASTING_SCHEMA_VERSION = 1;

export interface RoastingDocument extends Omit<Roasting, '_id'>, Document {
  schemaVersion: number;
}

const roastingSchema = new Schema<RoastingDocument>({
  _id: { type: String },
  schemaVersion: {
    type: Number,
    default: ROASTING_SCHEMA_VERSION,
    required: true,
  },
  roastingDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: RoastingStatus,
    required: true,
  },
  finishedBatches: [
    {
      roastedCoffeeId: { type: Number, required: true },
      amount: { type: Number, required: true },
    },
  ],
  greenCoffeeUsed: [
    {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      batchWeight: { type: Number, required: true },
      roastingLossFactor: { type: Number, required: true },
    },
  ],
  realYield: [
    {
      roastedCoffeeId: { type: Number, required: true },
      weight: { type: Number, required: true },
    },
  ],
  orders: [{ type: [Number], required: true }],
});

export const RoastingModel = model<RoastingDocument>(
  'Roasting',
  roastingSchema
);
