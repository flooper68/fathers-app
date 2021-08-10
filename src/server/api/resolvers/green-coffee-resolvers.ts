import { findRoastedCoffee } from './../../roasting/repositories/roasted-coffee-repository';
import {
  findOneGreenCoffee,
  findGreenCoffee,
} from './../../roasting/repositories/green-coffee-repository';

export const getGreenCoffee = async (id: number) => {
  const greenCoffee = await findOneGreenCoffee({ where: { id } });

  return {
    ...greenCoffee,
    roastedCoffees: () => getGreenCoffeesRoastedCoffees(id),
  };
};

export const getGreenCoffeesRoastedCoffees = async (greenCoffeeId: number) => {
  const rows = await findRoastedCoffee({ where: { greenCoffeeId } });
  return rows.map((coffee) => {
    return {
      ...coffee,
      greenCoffee: () => getGreenCoffee(coffee.greenCoffeeId),
    };
  });
};

export const getGreenCoffees = async () => {
  const rows = await findGreenCoffee();
  return rows.map((coffee) => {
    return {
      ...coffee,
      roastedCoffees: () => getGreenCoffeesRoastedCoffees(coffee.id),
    };
  });
};
