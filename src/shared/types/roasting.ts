import { GreenCoffee } from './green-coffee';

export interface Roasting {
  _id: string;
  roastingDate: string;
  status: RoastingStatus;
  orders: number[];
  greenCoffeeUsed: GreenCoffee[];
  finishedBatches: {
    roastedCoffeeId: string;
    amount: number;
  }[];
  realYield: {
    roastedCoffeeId: string;
    weight: number;
  }[];
}

export enum RoastingStatus {
  FINISHED = 'FINISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_PLANNING = 'IN_PLANNING',
}

export interface RoastingGreenCoffee {
  id: number;
  weight: number;
  name: string;
  batchWeight: number;
  roastingLossFactor: number;
}

export interface RoastingRoastedCoffee {
  id: number;
  name: string;
  numberOfBatches: number;
  finishedBatches: number;
  weight: number;
  realYield: number;
}
