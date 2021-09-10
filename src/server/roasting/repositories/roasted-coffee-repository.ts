import { RoastedCoffee } from '../../../shared/types/roasted-coffee';
import {
  FindOneRoastedCoffee,
  FindRoastedCoffee,
} from './../interfaces/roasting-repository';

const RoastedCoffeeMap: Record<number, RoastedCoffee> = {
  [1]: { id: 1, name: 'Brazilie - Cafeina Espresso', greenCoffeeId: 1 },
  [2]: { id: 2, name: 'Brazilie - Manga larga Filtr', greenCoffeeId: 2 },
  [3]: { id: 3, name: 'Brazilie - Manga larga Espresso', greenCoffeeId: 2 },
  [4]: { id: 4, name: 'Kolumbie - Canas Gordas Filtr', greenCoffeeId: 3 },
  [5]: { id: 5, name: 'Kolumbie - Canas Gordas Espresso', greenCoffeeId: 3 },
  [6]: { id: 6, name: 'Kenya - Gititu AA Filtr', greenCoffeeId: 4 },
  [7]: { id: 7, name: 'Nikaragua - Bethania washed Filtr', greenCoffeeId: 5 },
  [8]: { id: 8, name: 'Nikaragua - Bethania natural Filtr', greenCoffeeId: 6 },
  [9]: { id: 9, name: 'Nikaragua - Los Nubarrones Filtr', greenCoffeeId: 7 },
  [10]: {
    id: 10,
    name: 'Nikaragua - Los Nubarrones Espresso',
    greenCoffeeId: 7,
  },
  [11]: { id: 11, name: 'Indonésie - Pegasing washed Filtr', greenCoffeeId: 8 },
  [12]: {
    id: 12,
    name: 'Indonésie - Pegasing washed Espresso',
    greenCoffeeId: 8,
  },
  [13]: {
    id: 13,
    name: 'Indonésie - Pegasing natural Filtr',
    greenCoffeeId: 9,
  },
  [14]: {
    id: 14,
    name: 'Indonésie - Pegasing natural Espresso',
    greenCoffeeId: 9,
  },
  [15]: {
    id: 15,
    name: 'Indonésie - Pegasing anaerobic Filtr',
    greenCoffeeId: 10,
  },
  [16]: { id: 16, name: 'Nikaragua - La Coquimba Espresso', greenCoffeeId: 11 },
};

export const findRoastedCoffee: FindRoastedCoffee = async (conditions) => {
  return Object.values(RoastedCoffeeMap).filter((item) => {
    if (!conditions?.where?.greenCoffeeId) {
      return true;
    }

    return item.greenCoffeeId === conditions.where.greenCoffeeId;
  });
};

export const findOneRoastedCoffee: FindOneRoastedCoffee = async (
  conditions
) => {
  return RoastedCoffeeMap[conditions.where.id];
};
