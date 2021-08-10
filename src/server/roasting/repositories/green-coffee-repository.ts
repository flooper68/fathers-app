import { GreenCoffee } from '../../../shared/types/green-coffee';
import {
  FindGreenCoffee,
  FindOneGreenCoffee,
} from '../interfaces/roasting-repository';

const GreenCoffeeMap: Record<number, GreenCoffee> = {
  [1]: {
    id: 1,
    name: 'Kolumbie - La Colombia',
    batchWeight: 10,
    roastingLossFactor: 0.85,
  },
  [2]: {
    id: 2,
    name: 'Peru - El Paraiso',
    batchWeight: 10,
    roastingLossFactor: 0.9,
  },
  [3]: {
    id: 3,
    name: 'Brazílie - PAUBRASIL',
    batchWeight: 10,
    roastingLossFactor: 0.9,
  },
  [4]: {
    id: 4,
    name: 'Kolumbie - Canas Gordas',
    batchWeight: 10,
    roastingLossFactor: 0.9,
  },
  [5]: {
    id: 5,
    name: 'Brazilie - Manga larga',
    batchWeight: 10,
    roastingLossFactor: 0.9,
  },
  [6]: {
    id: 6,
    name: 'Brazilie - Cafeina',
    batchWeight: 10,
    roastingLossFactor: 0.9,
  },
  [7]: {
    id: 7,
    name: 'Kenya - Gititu AA',
    batchWeight: 10,
    roastingLossFactor: 0.9,
  },
};

export const findGreenCoffee: FindGreenCoffee = async () => {
  return Object.values(GreenCoffeeMap);
};

export const findOneGreenCoffee: FindOneGreenCoffee = async (conditions: {
  where: { id: number };
}) => {
  return GreenCoffeeMap[conditions.where.id];
};
