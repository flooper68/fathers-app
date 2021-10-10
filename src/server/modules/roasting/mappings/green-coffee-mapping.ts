import { GreenCoffee } from '../../../../shared/types/green-coffee';
import { GreenCoffeeEntity } from '../entities/green-coffee-entity';
import { GreenCoffeeDocument } from '../repositories/green-coffee-repository';

const mapEntityToDTO = (entity: GreenCoffeeEntity): GreenCoffee => {
  return {
    id: entity.id,
    name: entity.name,
    batchWeight: entity.batchWeight,
    roastingLossFactor: entity.roastingLossFactor,
  };
};

const mapDocToEntity = (doc: GreenCoffeeDocument): GreenCoffeeEntity => {
  return GreenCoffeeEntity.create({
    id: doc.id,
    name: doc.name,
    batchWeight: doc.batchWeight,
    roastingLossFactor: doc.roastingLossFactor,
  });
};

const mapEntityToDoc = (entity: GreenCoffeeEntity) => {
  return {
    _id: entity.id,
    name: entity.name,
    batchWeight: entity.batchWeight,
    roastingLossFactor: entity.roastingLossFactor,
  };
};

export const GreenCoffeeMapping = {
  mapEntityToDTO,
  mapEntityToDoc,
  mapDocToEntity,
};
