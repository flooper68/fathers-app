export class RoastingNotInPlanning extends Error {
  constructor() {
    super(`Roasting is not being planned`);
  }
}

export class RoastingLineItemDoesNotBelongToOrder extends Error {
  constructor() {
    super(`Line Item does not belong to any order`);
  }
}
