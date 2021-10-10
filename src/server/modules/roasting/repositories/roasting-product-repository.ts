import { Schema, Document, model } from 'mongoose';

import { RoastingProductRepository } from '../roasting-contracts';
import { RoastingProductMapping } from '../mappings/roasting-product-mapping';

const GREEN_COFFEE_SCHEMA_VERSION = 1;

export interface RoastingProductDocument extends Document {
  schemaVersion: number;
  _id: number;
  roastedCoffeeId: string;
}

const schema = new Schema<RoastingProductDocument>({
  _id: { type: Number },
  schemaVersion: {
    type: Number,
    default: GREEN_COFFEE_SCHEMA_VERSION,
    required: true,
  },
  roastedCoffeeId: String,
});

const MongooseModel = model<RoastingProductDocument>('roastingProduct', schema);

export const buildRoastingProductRepository = (): RoastingProductRepository => {
  return {
    save: async (product) => {
      await MongooseModel.updateOne(
        { _id: product.id },
        RoastingProductMapping.mapEntityToDoc(product)
      );
    },
    create: async (product) => {
      await MongooseModel.create(
        RoastingProductMapping.mapEntityToDoc(product)
      );
    },
    getOne: async (id) => {
      const doc = await MongooseModel.findById(id);
      if (!doc) {
        return;
      }
      return RoastingProductMapping.mapDocToEntity(doc);
    },
  };
};
