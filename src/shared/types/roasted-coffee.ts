export interface RoastedCoffee {
  id: number;
  name: string;
  greenCoffeeId: number;
}

export interface RoastedCoffeeProduct {
  productId: number;
  roastedCoffeeId: number;
}
