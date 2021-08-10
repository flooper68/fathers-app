import { RoastedCoffee } from './../../../shared/types/roasted-coffee';
import {
  findOneRoastedCoffee,
  findRoastedCoffee,
} from './../repositories/roasted-coffee-repository';
import { GreenCoffee } from './../../../shared/types/green-coffee';
import {
  findOneGreenCoffee,
  findGreenCoffee,
} from './../repositories/green-coffee-repository';
import { Roasting } from '../../../shared/types/roasting';
import { Logger } from '../../../shared/logger';
import { Order, OrderLineItem, OrderStatus } from '../../../shared/types/order';
import { getOrder } from '../../api/resolvers/order-resolvers';
import { RoastingRepository } from '../interfaces/roasting-repository';
import { OrderModel } from '../../sales/repository/order-model';
import { ProductModel } from '../../catalog/repository/product-model';

const READY_FOR_ROASTING_STATUSES = [
  OrderStatus.ON_HOLD,
  OrderStatus.PROCESSING,
  OrderStatus.COMPLETED,
];

const getEmptyRoastingObject = (
  greenCoffeeList: GreenCoffee[],
  roastedCoffeeList: RoastedCoffee[]
) => {
  return {
    greenCoffee: greenCoffeeList.map((greenCoffe) => ({
      ...greenCoffe,
      weight: 0,
    })),
    roastedCoffee: roastedCoffeeList.map(
      ({ greenCoffeeId, ...roastedCoffee }) => {
        const greenCoffee = greenCoffeeList.find(
          (item) => item.id === greenCoffeeId
        );

        if (!greenCoffee) {
          throw new Error(`Missing green coffee`);
        }

        return {
          ...roastedCoffee,
          weight: 0,
          numberOfBatches: 0,
          finishedBatches: 0,
          realYield: 0,
          expectedBatchYield:
            greenCoffee.batchWeight * greenCoffee.roastingLossFactor,
        };
      }
    ),
    totalWeight: 0,

    orders: [] as number[],
  };
};

export type RoastingObject = ReturnType<typeof getEmptyRoastingObject>;

const mergeRoastingData = (
  memo: RoastingObject,
  roastingData: RoastingObject
): RoastingObject => {
  return {
    totalWeight: memo.totalWeight + roastingData.totalWeight,
    orders: [...memo.orders, ...roastingData.orders],
    greenCoffee: memo.greenCoffee.map((greenCoffee) => {
      const coffee = roastingData.greenCoffee.find(
        (item) => item.id === greenCoffee.id
      );

      if (!coffee) {
        throw new Error(`Invalid state - missing green coffee item for merge`);
      }
      return {
        ...greenCoffee,
        weight: greenCoffee.weight + coffee.weight,
      };
    }),
    roastedCoffee: memo.roastedCoffee.map((roastedCoffee) => {
      const coffee = roastingData.roastedCoffee.find(
        (item) => item.id === roastedCoffee.id
      );

      if (!coffee) {
        throw new Error(
          `Invalid state - missing roasted coffee item for merge`
        );
      }
      return {
        ...roastedCoffee,
        weight: roastedCoffee.weight + coffee.weight,
        numberOfBatches: roastedCoffee.numberOfBatches + coffee.numberOfBatches,
      };
    }),
  };
};

const getItemRoastingData = async (
  totalWeight: number,
  greenCoffeeId: number,
  lossFactor: number,
  batchWeight: number,
  roastedCoffeeId: number
) => {
  const greenCoffee = await findGreenCoffee();
  const roastedCoffee = await findRoastedCoffee();

  const roastingData = getEmptyRoastingObject(greenCoffee, roastedCoffee);

  roastingData.totalWeight += totalWeight;
  Logger.debug(`Total weight ${totalWeight}`);

  roastingData.greenCoffee = roastingData.greenCoffee.map((coffee) => {
    if (coffee.id === greenCoffeeId) {
      Logger.debug(
        `Green coffee ${coffee.name}, amount ${totalWeight / lossFactor}`
      );
      return {
        ...coffee,

        weight: totalWeight / lossFactor,
      };
    }
    return coffee;
  });

  roastingData.roastedCoffee = roastingData.roastedCoffee.map((coffee) => {
    if (coffee.id === roastedCoffeeId) {
      Logger.debug(
        `Roasted coffee ${coffee.name}, amount ${totalWeight}, batches ${
          totalWeight / lossFactor / batchWeight
        }`
      );
      return {
        ...coffee,
        weight: totalWeight,
        numberOfBatches: totalWeight / lossFactor / batchWeight,
      };
    }
    return coffee;
  });

  return roastingData;
};

const mapLineItemForRoasting = async (lineItem: OrderLineItem) => {
  const product = await ProductModel.findOne({
    id: lineItem.productId,
  });

  if (!product) {
    throw new Error(
      `Invalid state - missing product ${lineItem.productId} in database, try syncing products with WooCommerce`
    );
  }

  if (!product?.roastedCoffeeId) {
    Logger.info(`Product ${product.name} is not roastable, skipping`);
    return;
  }

  const roastedCoffee = await findOneRoastedCoffee({
    where: { id: product.roastedCoffeeId },
  });

  const greenCoffee = await findOneGreenCoffee({
    where: { id: roastedCoffee.greenCoffeeId },
  });

  const variation = product.variations.find(
    (variation) => variation.id === lineItem.variationId
  );

  if (!variation) {
    throw new Error('Missing product variation');
  }

  if (!variation.weight) {
    throw new Error('Variation is missing weight');
  }

  const totalWeight = lineItem.quantity * variation.weight;

  Logger.info(
    `Processing item ${lineItem.id} with product ${product.name} for roasting`
  );
  return await getItemRoastingData(
    totalWeight,
    greenCoffee.id,
    greenCoffee.roastingLossFactor,
    greenCoffee.batchWeight,
    roastedCoffee.id
  );
};

const processOrderForRoasting = async (order: Order) => {
  const greenCoffee = await findGreenCoffee();
  const roastedCoffee = await findRoastedCoffee();

  if (!READY_FOR_ROASTING_STATUSES.includes(order.status)) {
    Logger.info(
      `Skipping roasting processing for order ${order.id}, status ${order.status}`
    );
    return getEmptyRoastingObject(greenCoffee, roastedCoffee);
  }

  const itemsRoastingData = await Promise.all(
    order.lineItems.map(mapLineItemForRoasting)
  );

  const roastableItems = itemsRoastingData.filter(
    (item) => item !== undefined
  ) as RoastingObject[];

  if (roastableItems.length === 0) {
    Logger.info(
      `Skipping roasting processing for order ${order.id}, there are no roastable items`
    );
    return getEmptyRoastingObject(greenCoffee, roastedCoffee);
  }

  const orderRoastingData = roastableItems.reduce<RoastingObject>(
    mergeRoastingData,
    await getEmptyRoastingObject(greenCoffee, roastedCoffee)
  );
  return orderRoastingData;
};

const buidGetGreenCoffee = (item: { orders: number[] }) => async () => {
  const orders = await OrderModel.find({ id: { $in: item.orders } });
  const greenCoffee = await findGreenCoffee();
  const roastedCoffee = await findRoastedCoffee();

  const ordersRoastingData = await Promise.all(
    orders.map(processOrderForRoasting)
  );
  const roastingData = ordersRoastingData.reduce<RoastingObject>(
    mergeRoastingData,
    await getEmptyRoastingObject(greenCoffee, roastedCoffee)
  );

  return roastingData.greenCoffee;
};

const buidGetRoastedCoffee = (item: { orders: number[] }) => async () => {
  const orders = await OrderModel.find({ id: { $in: item.orders } });
  const greenCoffee = await findGreenCoffee();
  const roastedCoffee = await findRoastedCoffee();

  const ordersRoastingData = await Promise.all(
    orders.map(processOrderForRoasting)
  );
  const roastingData = ordersRoastingData.reduce<RoastingObject>(
    mergeRoastingData,
    await getEmptyRoastingObject(greenCoffee, roastedCoffee)
  );

  return roastingData.roastedCoffee;
};

const buildMapRoasting = (item: Roasting) => {
  return {
    id: item._id,
    status: item.status,
    roastingDate: item.roastingDate,
    orders: () => Promise.all(item.orders.map((id) => getOrder(id))),
    greenCoffee: buidGetGreenCoffee(item),
    roastedCoffee: buidGetRoastedCoffee(item),
    finishedBatches: item.finishedBatches,
    realYield: item.realYield,
  };
};

export const getRoastingsProjection = (
  repository: RoastingRepository
) => async () => {
  const entities = await repository.find({ sort: { roastingDate: -1 } });
  return entities.map(buildMapRoasting);
};
