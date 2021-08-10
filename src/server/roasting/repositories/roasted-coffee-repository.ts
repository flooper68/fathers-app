import { RoastedCoffee } from '../../../shared/types/roasted-coffee';
import {
  FindOneRoastedCoffee,
  FindRoastedCoffee,
} from './../interfaces/roasting-repository';

const RoastedCoffeeMap: Record<number, RoastedCoffee> = {
  [1]: { id: 1, name: 'Kolumbie - La Colombia Filtr', greenCoffeeId: 1 },
  [2]: { id: 2, name: 'Kolumbie - La Colombia Espresso', greenCoffeeId: 1 },
  [3]: { id: 3, name: 'Peru - El Paraiso Filtr', greenCoffeeId: 2 },
  [4]: { id: 4, name: 'Peru - El Paraiso Espresso', greenCoffeeId: 2 },
  [5]: { id: 5, name: 'Brazílie - PAUBRASIL Espresso', greenCoffeeId: 3 },
  [6]: { id: 6, name: 'Kolumbie - Canas Gordas Filtr', greenCoffeeId: 4 },
  [7]: { id: 7, name: 'Kolumbie - Canas Gordas Espresso', greenCoffeeId: 4 },
  [8]: { id: 8, name: 'Brazilie - Manga larga Filtr', greenCoffeeId: 5 },
  [9]: { id: 9, name: 'Brazilie - Manga larga Espresso', greenCoffeeId: 5 },
  [10]: { id: 10, name: 'Brazilie - Cafeina Espresso', greenCoffeeId: 6 },
  [11]: { id: 11, name: 'Kenya - Gititu AA Filtr', greenCoffeeId: 7 },
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
