export class NegativeQuantityOnHand extends Error {
  constructor() {
    super(`Can not have negative quantity on hand`);
  }
}
