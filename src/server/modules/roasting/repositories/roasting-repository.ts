import moment from 'moment';
import { model, Schema, Document } from 'mongoose';

import { RoastingMapping } from './../mappings/roasting-mapping';
import { Roasting, RoastingStatus } from '../../../../shared/types/roasting';
import { RoastingRepository } from '../roasting-contracts';

const SCHEMA_VERSION = 1;

export interface RoastingDocument extends Omit<Roasting, '_id'>, Document {
  schemaVersion: number;
}

const schema = new Schema<RoastingDocument>({
  _id: { type: String },
  schemaVersion: {
    type: Number,
    default: SCHEMA_VERSION,
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
      roastedCoffeeId: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
  greenCoffeeUsed: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      batchWeight: { type: Number, required: true },
      roastingLossFactor: { type: Number, required: true },
    },
  ],
  realYield: [
    {
      roastedCoffeeId: { type: String, required: true },
      weight: { type: Number, required: true },
    },
  ],
  orders: [{ type: [Number], required: true }],
});

const MongooseModel = model<RoastingDocument>('Roasting', schema);

export const buildRoastingRepository = (): RoastingRepository => {
  return {
    getAll: async () => {
      const entities = await MongooseModel.find().sort({ roastingDate: -1 });
      return entities.map(RoastingMapping.mapDocToEntity);
    },
    getOne: async (id: string) => {
      const doc = await MongooseModel.findById(id);
      if (!doc) {
        return;
      }
      return RoastingMapping.mapDocToEntity(doc);
    },
    getRoastingsPlannedForToday: async () => {
      const today = moment().startOf('day').toISOString();

      const plannedRoastings = await MongooseModel.find({
        status: RoastingStatus.IN_PLANNING,
        roastingDate: today,
      });
      return plannedRoastings.map(RoastingMapping.mapDocToEntity);
    },
    getRoastingsInProgress: async () => {
      const plannedRoastings = await MongooseModel.find({
        status: RoastingStatus.IN_PROGRESS,
      });
      return plannedRoastings.map(RoastingMapping.mapDocToEntity);
    },
    getRoastingByOrder: async (orderId: number) => {
      const currentRoasting = await MongooseModel.findOne({
        orders: { $in: [orderId] },
      });
      if (!currentRoasting) {
        return;
      }
      return RoastingMapping.mapDocToEntity(currentRoasting);
    },

    create: async (roasting: Roasting) => {
      await MongooseModel.create(roasting);
    },
    save: async (roasting: Roasting) => {
      await MongooseModel.updateOne({ _id: roasting._id }, roasting);
    },
  };
};
