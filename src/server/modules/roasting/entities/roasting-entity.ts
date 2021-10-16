import { RoastingFinished } from '../events/roasting-finished';
import { DomainEvent } from './../../common';
import moment from 'moment';
import { v4 } from 'uuid';

import { Roasting, RoastingStatus } from '../../../../shared/types/roasting';
import { Logger } from '../../../../shared/logger';
import { GreenCoffee } from '../../../../shared/types/green-coffee';

export const createRoasting = (roastingDate: string): Roasting => {
  const roastingDateMoment = moment(roastingDate);
  if (!roastingDateMoment.isValid()) {
    throw new Error(`Roasting date ${roastingDate} is not valid`);
  }

  console.log(roastingDate, roastingDateMoment.format());

  return {
    _id: v4(),
    roastingDate: roastingDateMoment.startOf('day').toISOString(),
    status: RoastingStatus.IN_PLANNING,
    orders: [],
    finishedBatches: [],
    realYield: [],
    greenCoffeeUsed: [],
  };
};

export const getStartedRoasting = (
  roasting: Roasting,
  greenCoffee: GreenCoffee[]
): Roasting => {
  return {
    ...roasting,
    status: RoastingStatus.IN_PROGRESS,
    greenCoffeeUsed: greenCoffee,
  };
};

export const finishRoastedBatch = (
  roasting: Roasting,
  roastedCoffeeId: string
): Roasting => {
  const finishedBatchExists = roasting.finishedBatches.some(
    (item) => item.roastedCoffeeId === roastedCoffeeId
  );

  if (!finishedBatchExists) {
    Logger.debug(
      `Roasted coffee ${roastedCoffeeId} does not exist yet, creating new one`
    );
    return {
      ...roasting,
      finishedBatches: [
        ...roasting.finishedBatches,
        { roastedCoffeeId, amount: 1 },
      ],
    };
  }

  return {
    ...roasting,
    finishedBatches: roasting.finishedBatches.map((item) => {
      if (item.roastedCoffeeId !== roastedCoffeeId) {
        return item;
      }
      Logger.debug(
        `Increasing amount for roasted coffe ${item.roastedCoffeeId} to ${
          item.amount + 1
        }`
      );
      return { ...item, amount: item.amount + 1 };
    }),
  };
};

export const finishRoasting = (
  roasting: Roasting
): { roasting: Roasting; events: DomainEvent[] } => {
  return {
    roasting: { ...roasting, status: RoastingStatus.FINISHED },
    events: [new RoastingFinished(roasting)],
  };
};

export const removeOrderFromRoasting = (
  roasting: Roasting,
  orderId: number
): Roasting => {
  if (!roasting.orders.some((item) => item === orderId)) {
    throw new Error(`Order is not in the roasting`);
  }

  return {
    ...roasting,
    orders: roasting.orders.filter((item) => item !== orderId),
  };
};

export const addOrderToRoasting = (
  roasting: Roasting,
  orderId: number
): Roasting => {
  if (roasting.orders.some((item) => item === orderId)) {
    throw new Error(`Order is already in the roasting`);
  }

  return {
    ...roasting,
    orders: [...roasting.orders, orderId],
  };
};

export const reportRealYield = (
  roasting: Roasting,
  roastedCoffeeId: string,
  weight: number
): Roasting => {
  const alreadyReported = roasting.realYield.some(
    (item) => item.roastedCoffeeId === roastedCoffeeId
  );

  if (alreadyReported) {
    return {
      ...roasting,
      realYield: roasting.realYield.map((item) => {
        if (item.roastedCoffeeId !== roastedCoffeeId) {
          return item;
        }
        return {
          roastedCoffeeId,
          weight,
        };
      }),
    };
  }

  return {
    ...roasting,
    realYield: [
      ...roasting.realYield,
      {
        roastedCoffeeId,
        weight,
      },
    ],
  };
};
