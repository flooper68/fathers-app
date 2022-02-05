import { WarehouseRoastedCoffeeState } from './warehouse-roasted-coffee-types';
import { NegativeQuantityOnHand } from './warehouse-roasted-coffee-errors';

export const checkWarehouseRoastedCoffeeInvariants = (
  state: WarehouseRoastedCoffeeState
): void => {
  if (state.quantityOnHand < 0) {
    throw new NegativeQuantityOnHand();
  }
};
