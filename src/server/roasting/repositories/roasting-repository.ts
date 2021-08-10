import { Roasting, RoastingStatus } from '../../../shared/types/roasting';
import { RoastingRepository } from '../interfaces/roasting-repository';
import { RoastingModel, RoastingDocument } from './roasting-model';

const mapDocumentToRoasting = (item: RoastingDocument): Roasting => {
  const object = item.toObject();
  return {
    _id: object._id,
    status: object.status,
    orders: object.orders,
    roastingDate: object.roastingDate,
    greenCoffeeUsed: object.greenCoffeeUsed,
    finishedBatches: object.finishedBatches,
    realYield: object.realYield,
  };
};

export const buildRoastingRepository = (): RoastingRepository => {
  return {
    find: async (config?: {
      where?: {
        status?: RoastingStatus;
        roastingDate?: string;
      };
      sort?: {
        id?: number;
        roastingDate?: number;
      };
    }): Promise<Roasting[]> => {
      const results = await RoastingModel.find(config?.where || {}).sort(
        config?.sort || {}
      );

      return results.map(mapDocumentToRoasting);
    },
    findOrdersRoasting: async (orderId: number): Promise<Roasting | null> => {
      const currentRoasting = await RoastingModel.findOne({
        orders: { $in: [orderId] },
      });
      if (!currentRoasting) {
        return null;
      }
      return mapDocumentToRoasting(currentRoasting);
    },

    create: async (roasting: Roasting) => {
      await RoastingModel.create(roasting);
    },
    save: async (roasting: Roasting) => {
      await RoastingModel.updateOne({ _id: roasting._id }, roasting);
    },
  };
};
