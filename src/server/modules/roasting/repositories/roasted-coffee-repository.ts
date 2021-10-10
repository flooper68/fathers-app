import { Schema, Document, model } from 'mongoose';

import { RoastedCoffee } from '../../../../shared/types/roasted-coffee';
import { RoastedCoffeeRepository } from '../roasting-contracts';
import { RoastedCoffeeMapping } from '../mappings/roasted-coffee-mapping';

const SCHEMA_VERSION = 1;

export interface RoastedCoffeeDocument
  extends Omit<RoastedCoffee, 'id'>,
    Document {
  schemaVersion: number;
}

const schema = new Schema<RoastedCoffeeDocument>({
  _id: { type: String },
  schemaVersion: {
    type: Number,
    default: SCHEMA_VERSION,
    required: true,
  },
  name: String,
  greenCoffeeId: String,
});

const MongooseModel = model<RoastedCoffeeDocument>('roastedCoffees', schema);

export const buildRoastedCoffeeRepository = (): RoastedCoffeeRepository => {
  return {
    save: async (coffee) => {
      await MongooseModel.updateOne(
        { _id: coffee.id },
        RoastedCoffeeMapping.mapEntityToDoc(coffee)
      );
    },
    create: async (coffee) => {
      await MongooseModel.create(RoastedCoffeeMapping.mapEntityToDoc(coffee));
    },
    getOne: async (id) => {
      const doc = await MongooseModel.findById(id);
      if (!doc) {
        return;
      }
      return RoastedCoffeeMapping.mapDocToEntity(doc);
    },
    getAll: async () => {
      const entities = await MongooseModel.find();
      return entities.map(RoastedCoffeeMapping.mapDocToEntity);
    },
    exists: async (id) => {
      return MongooseModel.exists({ _id: id });
    },
  };
};
