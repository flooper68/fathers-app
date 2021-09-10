import { FindOneRoastedCoffeeProduct } from './../interfaces/roasting-repository';

const RoastedCoffeeProductMap: Record<number, number> = {
  [12994]: 1, // Brazilie - Cafeina Espresso
  [12955]: 2, // Brazilie - Manga larga Filtr
  [12930]: 3, // Brazilie - Manga larga Espresso
  [13234]: 4, // Kolumbie - Canas Gordas Filtr
  [13268]: 5, // Kolumbie - Canas Gordas Espresso
  [13477]: 6, // Kenya - Gititu AA Filtr
  [14224]: 7, // Nikaragua - Bethania washed Filtr
  [14216]: 8, // Nikaragua - Bethania natural Filtr
  [14201]: 9, // Nikaragua - Los Nubarrones Filtr
  [14178]: 10, // Nikaragua - Los Nubarrones Espresso
  [14426]: 11, // Indonésie - Pegasing washed Filtr
  [14473]: 12, // Indonésie - Pegasing washed Espresso
  [14481]: 13, // Indonésie - Pegasing natural Filtr
  [14447]: 14, // Indonésie - Pegasing natural Espresso
  [14496]: 15, // Indonésie - Pegasing anaerobic Filtr
  [14633]: 16, // Nikaragua - La Coquimba Espresso
};

export const findOneRoastedCoffeeProduct: FindOneRoastedCoffeeProduct = async (conditions: {
  where: { productId: number };
}) => {
  return {
    productId: conditions.where.productId,
    roastedCoffeeId: RoastedCoffeeProductMap[conditions.where.productId],
  };
};
