import { Roasting } from '../../../../shared/types/roasting';
import { RoastingDocument } from '../repositories/roasting-repository';

const mapDocToEntity = (item: RoastingDocument): Roasting => {
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

const mapEntityToDTO = (entity: Roasting): Roasting => {
  return entity;
};

export const RoastingMapping = {
  mapDocToEntity,
  mapEntityToDTO,
};
