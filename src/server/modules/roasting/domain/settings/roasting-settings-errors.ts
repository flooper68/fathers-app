export class GreenCoffeeInvalidBatchWeight extends Error {
  constructor() {
    super(`Green Coffee batchWeight must be higher than 0`);
  }
}

export class GreenCoffeeInvalidLossFactor extends Error {
  constructor() {
    super(`Green Coffee roastweight must be between 0 and 1`);
  }
}

export class GreenCoffeeAlreadyExists extends Error {
  constructor() {
    super(`Green Coffee already exists`);
  }
}

export class GreenCoffeeDoesNotExist extends Error {
  constructor() {
    super(`Green Coffee does not exist`);
  }
}

export class RoastedCoffeeAlreadyExists extends Error {
  constructor() {
    super(`Roasted Coffee already exists`);
  }
}
export class RoastedCoffeeDoesNotExist extends Error {
  constructor() {
    super(`Roasted Coffee does not exist`);
  }
}

export class RoastedCoffeeBelongsToUnknownEntity extends Error {
  constructor() {
    super(`Roasted Coffee belongs to non existent entity`);
  }
}

export class NegativeProductVariationWeight extends Error {
  constructor() {
    super(`Product variation can not have negative weight`);
  }
}
