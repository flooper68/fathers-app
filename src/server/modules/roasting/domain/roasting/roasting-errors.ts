export class RoastingNotInPlanning extends Error {
  constructor() {
    super(`Roasting is not being planned`);
  }
}

export class RoastingNotInProgress extends Error {
  constructor() {
    super(`Roasting is not in progress`);
  }
}

export class AllBatchesAlreadyFinished extends Error {
  constructor() {
    super(`All batches are already finished`);
  }
}

export class RoastingLineItemDoesNotBelongToOrder extends Error {
  constructor() {
    super(`Line Item does not belong to any order`);
  }
}

export class RoastingOrderDoesNotExist extends Error {
  constructor() {
    super(`Roasting order does not exist`);
  }
}

export class BatchesAreNotAllRoasted extends Error {
  constructor() {
    super(`Not all bathces are roasted yet`);
  }
}

export class AllBatchesAreNotFinished extends Error {
  constructor() {
    super(`All planned batches are not finished`);
  }
}

export class AllYieldsAreNotReported extends Error {
  constructor() {
    super(`All yields are not reported`);
  }
}

export class RoastingInPlanningHasFinishedBatches extends Error {
  constructor() {
    super(`Roasting in Planning can not have finished batches`);
  }
}

export class RoastingInPlanningHasReportedYields extends Error {
  constructor() {
    super(`Roasting in Planning can not have reported yields`);
  }
}

export class RoastingInPlanningHasRoastinPlan extends Error {
  constructor() {
    super(`Roasting in Planning has missing roasting plan`);
  }
}

export class RoastingDoesNotHaveRoastinPlan extends Error {
  constructor() {
    super(`Roasting does not have roasting plan`);
  }
}
