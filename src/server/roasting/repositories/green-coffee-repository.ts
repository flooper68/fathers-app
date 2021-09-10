import { GreenCoffee } from '../../../shared/types/green-coffee';
import {
  FindGreenCoffee,
  FindOneGreenCoffee,
} from '../interfaces/roasting-repository';

const GreenCoffeeMap: Record<number, GreenCoffee> = {
  [1]: {
    id: 1,
    name: 'Brazilie - Cafeina',
    batchWeight: 12,
    roastingLossFactor: 0.85,
  },
  [2]: {
    id: 2,
    name: 'Brazilie - Manga larga',
    batchWeight: 10,
    roastingLossFactor: 0.85,
  },
  [3]: {
    id: 3,
    name: 'Kolumbie - Canas Gordas',
    batchWeight: 10,
    roastingLossFactor: 0.85,
  },
  [4]: {
    id: 4,
    name: 'Kenya - Gititu AA',
    batchWeight: 10,
    roastingLossFactor: 0.85,
  },
  [5]: {
    id: 5,
    name: 'Nikaragua - Bethania washed',
    batchWeight: 10,
    roastingLossFactor: 0.85,
  },
  [6]: {
    id: 6,
    name: 'Nikaragua - Bethania natural',
    batchWeight: 10,
    roastingLossFactor: 0.85,
  },
  [7]: {
    id: 7,
    name: 'Nikaragua - Los Nubarrones',
    batchWeight: 10,
    roastingLossFactor: 0.85,
  },
  [8]: {
    id: 8,
    name: 'Indonésie - Pegasing washed',
    batchWeight: 10,
    roastingLossFactor: 0.85,
  },
  [9]: {
    id: 9,
    name: 'Indonésie - Pegasing natural',
    batchWeight: 10,
    roastingLossFactor: 0.85,
  },
  [10]: {
    id: 10,
    name: 'Indonésie - Pegasing anaerobic',
    batchWeight: 10,
    roastingLossFactor: 0.85,
  },
  [11]: {
    id: 11,
    name: 'Nikarague - La Coquimba',
    batchWeight: 10,
    roastingLossFactor: 0.85,
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
