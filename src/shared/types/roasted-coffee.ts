export interface RoastedCoffee {
  id: string;
  name: string;
  greenCoffeeId: string;
}

export interface RoastedCoffeeProduct {
  id: number;
  roastedCoffeeId: string;
}

export interface RoastingProduct {
  id: number;
  roastedCoffeeId?: string | null;
}
