import { RoastedCoffeeDocument } from '../repositories/roasted-coffee-repository';
import { RoastedCoffeeEntity } from '../entities/roasted-coffee-entity';

const mapEntityToDTO = (entity: RoastedCoffeeEntity) => {
  return {
    id: entity.id,
    name: entity.name,
    greenCoffeeId: entity.greenCoffeeId,
  };
};

const mapEntityToDoc = (entity: RoastedCoffeeEntity) => {
  return {
    _id: entity.id,
    name: entity.name,
    greenCoffeeId: entity.greenCoffeeId,
  };
};

const mapDocToEntity = (document: RoastedCoffeeDocument) => {
  return RoastedCoffeeEntity.create({
    id: document.id,
    name: document.name,
    greenCoffeeId: document.greenCoffeeId,
  });
};

export const RoastedCoffeeMapping = {
  mapEntityToDTO,
  mapEntityToDoc,
  mapDocToEntity,
};
