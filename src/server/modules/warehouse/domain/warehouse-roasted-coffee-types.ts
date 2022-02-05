import { DomainAction, DomainActionContext } from '../../common/aggregate-root';

export interface WarehouseRoastedCoffeeState {
  uuid: string;
  quantityOnHand: number;
}

export type WarehouseRoastedCoffeeContextExtension = void;

export type WarehouseRoastedCoffeeContext = DomainActionContext<
  WarehouseRoastedCoffeeState,
  WarehouseRoastedCoffeeContextExtension
>;

export type WarehouseRoastedCoffeeDomainAction<P> = DomainAction<
  P,
  WarehouseRoastedCoffeeContext
>;
