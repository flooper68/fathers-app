import { Schema, model } from 'mongoose'

import { DocumentWithSchemaVersion } from './../types/general'
import { Roasting, RoastingStatus } from './../../shared/types/roasting'

const ROASTING_SCHEMA_VERSION = 1

export interface RoastingDocument
  extends Omit<Roasting, 'id'>,
    DocumentWithSchemaVersion {}

const roastingSchema = new Schema<RoastingDocument>({
  schemaVersion: {
    type: Number,
    default: ROASTING_SCHEMA_VERSION,
    required: true,
  },
  status: {
    type: String,
    enum: RoastingStatus,
    default: RoastingStatus.IN_PLANNING,
  },
  greenCoffee: [
    new Schema({
      id: { type: Number, required: true },
      name: { type: String, required: true },
      batchWeight: { type: Number, required: true },
      roastingLossFactor: { type: Number, required: true },
      weight: { type: Number, required: true, default: 0 },
    }),
  ],
  roastedCoffee: [
    new Schema({
      id: { type: Number, required: true },
      name: { type: String, required: true },
      numberOfBatches: { type: Number, required: true, default: 0 },
      finishedBatches: { type: Number, required: true, default: 0 },
      weight: { type: Number, required: true, default: 0 },
      realYield: { type: Number, required: true, default: 0 },
    }),
  ],
  totalWeight: {
    type: Number,
    required: true,
    default: 0,
  },
  orders: [{ type: Number }],
})

export const RoastingModel = model<RoastingDocument>('Roasting', roastingSchema)
