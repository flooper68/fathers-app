import { RoastingProduct } from './../../../../shared/types/roasted-coffee';
import { RoastingProductEntity } from '../entities/roasting-product-entity';
import { RoastingProductDocument } from '../repositories/roasting-product-repository';

const mapEntityToDoc = (entity: RoastingProductEntity) => {
  return {
    _id: entity.id,
    roastedCoffeeId: entity.roastedCoffeeId || undefined,
  };
};

const mapEntityToDTO = (entity: RoastingProductEntity): RoastingProduct => {
  return { id: entity.id, roastedCoffeeId: entity.roastedCoffeeId };
};

const mapDocToEntity = (
  doc: RoastingProductDocument
): RoastingProductEntity => {
  return RoastingProductEntity.create({
    id: doc.id,
    roastedCoffeeId: doc.roastedCoffeeId,
  });
};

export const RoastingProductMapping = {
  mapEntityToDoc,
  mapEntityToDTO,
  mapDocToEntity,
};
