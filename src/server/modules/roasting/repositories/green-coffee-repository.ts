import { Schema, Document, model } from 'mongoose';

import { GreenCoffee } from '../../../../shared/types/green-coffee';
import { GreenCoffeeRepository } from '../roasting-contracts';
import { GreenCoffeeMapping } from '../mappings/green-coffee-mapping';

const GREEN_COFFEE_SCHEMA_VERSION = 1;

export interface GreenCoffeeDocument extends Omit<GreenCoffee, 'id'>, Document {
  schemaVersion: number;
}

const schema = new Schema<GreenCoffeeDocument>({
  _id: { type: String },
  schemaVersion: {
    type: Number,
    default: GREEN_COFFEE_SCHEMA_VERSION,
    required: true,
  },
  name: String,
  batchWeight: Number,
  roastingLossFactor: Number,
});

const MongooseModel = model<GreenCoffeeDocument>('greenCoffees', schema);

export const buildGreenCoffeeRepository = (): GreenCoffeeRepository => {
  return {
    save: async (coffee) => {
      await MongooseModel.updateOne(
        { _id: coffee.id },
        GreenCoffeeMapping.mapEntityToDoc(coffee)
      );
    },
    create: async (coffee) => {
      await MongooseModel.create(GreenCoffeeMapping.mapEntityToDoc(coffee));
    },
    getOne: async (id) => {
      const doc = await MongooseModel.findById(id);

      if (!doc) {
        return;
      }

      return GreenCoffeeMapping.mapDocToEntity(doc);
    },
    getAll: async () => {
      const entities = await MongooseModel.find();
      return entities.map(GreenCoffeeMapping.mapDocToEntity);
    },
    exists: async (id) => {
      return MongooseModel.exists({ _id: id });
    },
  };
};
