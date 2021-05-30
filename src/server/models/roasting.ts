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
    default: RoastingStatus.PLANNED,
  },
  greenCoffee: [
    new Schema({
      id: { type: Number, required: true },
      weight: { type: Number, required: true },
      name: { type: String, required: true },
    }),
  ],
  roastedCoffee: [
    new Schema({
      id: { type: Number, required: true },
      weight: { type: Number, required: true },
      name: { type: String, required: true },
      numberOfBatches: { type: Number, required: true },
      finishedBatches: { type: Number, required: true, default: 0 },
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
