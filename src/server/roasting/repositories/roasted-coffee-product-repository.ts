import { FindOneRoastedCoffeeProduct } from './../interfaces/roasting-repository';

const RoastedCoffeeProductMap: Record<number, number> = {
  [13277]: 1, // Kolumbie - La Colombia Filtr, Káva
  [13286]: 2, // Kolumbie - La Colombia Espresso, Káva
  [9318]: 3, // Peru - El Paraiso Filtr, Káva
  [9331]: 4, // Peru - El Paraiso Filtr, Káva
  [4135]: 5, // Brazílie - PAUBRASIL Espresso
  [13234]: 6, //Kolumbie - Canas Gordas Filtr
  [13268]: 7, // Kolumbie - Canas Gordas Espresso
  [12955]: 8, // Brazilie - Manga larga Filtr
  [12930]: 9, // Brazilie - Manga larga Espresso
  [12994]: 10, // Brazilie - Cafeina Espresso
  [13477]: 11, // Kenya - Gititu AA Filtr
};

export const findOneRoastedCoffeeProduct: FindOneRoastedCoffeeProduct = async (conditions: {
  where: { productId: number };
}) => {
  return {
    productId: conditions.where.productId,
    roastedCoffeeId: RoastedCoffeeProductMap[conditions.where.productId],
  };
};
