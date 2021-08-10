import {
  RoastedCoffee,
  RoastedCoffeeProduct,
} from './../../../shared/types/roasted-coffee';
import { GreenCoffee } from './../../../shared/types/green-coffee';
import { Roasting } from '../../../shared/types/roasting';
import { RoastingStatus } from '../../../shared/types/roasting';

export type FindGreenCoffee = () => Promise<GreenCoffee[]>;

export type FindOneGreenCoffee = (conditions: {
  where: { id: number };
}) => Promise<GreenCoffee>;

export type FindRoastedCoffee = (conditions?: {
  where?: { greenCoffeeId?: number };
}) => Promise<RoastedCoffee[]>;

export type FindOneRoastedCoffee = (conditions: {
  where: { id: number };
}) => Promise<RoastedCoffee>;

export type FindOneRoastedCoffeeProduct = (conditions: {
  where: { productId: number };
}) => Promise<RoastedCoffeeProduct>;

export interface RoastingRepository {
  find: (conditions?: {
    where?: {
      status?: RoastingStatus;
      roastingDate?: string;
      orders?: number[];
      _id?: string;
    };
    sort?: {
      id?: number;
      roastingDate?: number;
    };
  }) => Promise<Roasting[]>;
  findOrdersRoasting: (orderId: number) => Promise<Roasting | null>;
  create: (roasting: Roasting) => Promise<void>;
  save: (roasting: Roasting) => Promise<void>;
}
