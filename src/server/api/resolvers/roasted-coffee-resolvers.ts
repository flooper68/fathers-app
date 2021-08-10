import {
  findRoastedCoffee,
  findOneRoastedCoffee,
} from './../../roasting/repositories/roasted-coffee-repository';
import { getGreenCoffee } from './green-coffee-resolvers';

export const getRoastedCoffee = async (id: number) => {
  const item = await findOneRoastedCoffee({ where: { id } });

  if (!item) {
    return undefined;
  }
  return {
    ...item,
    greenCoffee: () => getGreenCoffee(item.greenCoffeeId),
  };
};

export const getRoastedCoffees = async () => {
  const rows = await findRoastedCoffee();
  return rows.map((coffee) => {
    return {
      ...coffee,
      greenCoffee: () => getGreenCoffee(coffee.greenCoffeeId),
    };
  });
};
