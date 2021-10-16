import { CatalogModule } from '../modules/catalog/catalog-contracts';
import { SalesModule } from '../modules/sales/sales-contracts';
import { RoastingModule } from '../modules/roasting/roasting-contracts';
import { RoastedCoffee } from '../../shared/types/roasted-coffee';
import { GreenCoffee } from '../../shared/types/green-coffee';
import { Roasting } from '../../shared/types/roasting';
import { Logger } from '../../shared/logger';
import { Order, OrderLineItem, OrderStatus } from '../../shared/types/order';

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

type RoastingObject = ReturnType<typeof getEmptyRoastingObject>;

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
  greenCoffeeId: string,
  lossFactor: number,
  batchWeight: number,
  roastedCoffeeId: string,
  context: {
    roastingModule: RoastingModule;
  }
) => {
  const greenCoffee = await context.roastingModule.getAllGreenCoffees();
  const roastedCoffee = await context.roastingModule.getAllRoastedCoffees();

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

const buildMapLineItemForRoasting = (context: {
  roastingModule: RoastingModule;
  catalogModule: CatalogModule;
}) => async (lineItem: OrderLineItem) => {
  const product = await context.catalogModule.getProduct(lineItem.productId);

  const roastingProduct = await context.roastingModule.getRoastingProduct({
    id: lineItem.productId,
  });

  if (!product) {
    Logger.error(
      `Invalid state - missing product ${lineItem.productId} in database, try syncing products with WooCommerce`
    );
    throw new Error(
      `Invalid state - missing product ${lineItem.productId} in database, try syncing products with WooCommerce`
    );
  }

  if (!roastingProduct?.roastedCoffeeId) {
    Logger.info(`Product ${product.name} is not roastable, skipping`);
    return;
  }

  const roastedCoffee = await context.roastingModule.getRoastedCoffee({
    id: roastingProduct.roastedCoffeeId,
  });

  if (!roastedCoffee) {
    throw new Error('Missing roasted coffee');
  }

  const greenCoffee = await context.roastingModule.getGreenCoffee({
    id: roastedCoffee.greenCoffeeId,
  });

  if (!greenCoffee) {
    throw new Error('Missing green coffee');
  }

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
    roastedCoffee.id,
    context
  );
};

const buildProcessOrderForRoasting = (context: {
  roastingModule: RoastingModule;
  catalogModule: CatalogModule;
}) => async (order: Order) => {
  const greenCoffee = await context.roastingModule.getAllGreenCoffees();
  const roastedCoffee = await context.roastingModule.getAllRoastedCoffees();

  if (!READY_FOR_ROASTING_STATUSES.includes(order.status)) {
    Logger.info(
      `Skipping roasting processing for order ${order.id}, status ${order.status}`
    );
    return getEmptyRoastingObject(greenCoffee, roastedCoffee);
  }

  const itemsRoastingData = await Promise.all(
    order.lineItems.map(buildMapLineItemForRoasting(context))
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

const buidGetGreenCoffee = (
  item: { orders: number[] },
  context: {
    roastingModule: RoastingModule;
    catalogModule: CatalogModule;
    salesModule: SalesModule;
  }
) => async () => {
  const orders = await context.salesModule.getOrdersByIds(item.orders);
  const greenCoffee = await context.roastingModule.getAllGreenCoffees();
  const roastedCoffee = await context.roastingModule.getAllRoastedCoffees();

  const ordersRoastingData = await Promise.all(
    orders.map(buildProcessOrderForRoasting(context))
  );
  const roastingData = ordersRoastingData.reduce<RoastingObject>(
    mergeRoastingData,
    await getEmptyRoastingObject(greenCoffee, roastedCoffee)
  );

  return roastingData.greenCoffee;
};

const buidGetRoastedCoffee = (
  item: { orders: number[] },
  context: {
    roastingModule: RoastingModule;
    catalogModule: CatalogModule;
    salesModule: SalesModule;
  }
) => async () => {
  const orders = await context.salesModule.getOrdersByIds(item.orders);
  const greenCoffee = await context.roastingModule.getAllGreenCoffees();
  const roastedCoffee = await context.roastingModule.getAllRoastedCoffees();

  const ordersRoastingData = await Promise.all(
    orders.map(buildProcessOrderForRoasting(context))
  );
  const roastingData = ordersRoastingData.reduce<RoastingObject>(
    mergeRoastingData,
    await getEmptyRoastingObject(greenCoffee, roastedCoffee)
  );

  return roastingData.roastedCoffee;
};

const getFullProjection = async (
  item: Roasting,
  context: {
    roastingModule: RoastingModule;
    salesModule: SalesModule;
    catalogModule: CatalogModule;
  }
) => {
  return {
    id: item._id,
    status: item.status,
    roastingDate: item.roastingDate,
    orders: item.orders,
    greenCoffee: await buidGetGreenCoffee(item, context)(),
    roastedCoffee: await buidGetRoastedCoffee(item, context)(),
    finishedBatches: item.finishedBatches,
    realYield: item.realYield,
  };
};

export const buildRoastingProjection = (context: {
  roastingModule: RoastingModule;
  salesModule: SalesModule;
  catalogModule: CatalogModule;
}) => ({
  getFullProjection: (item: Roasting) => getFullProjection(item, context),
});

export type RoastingProjection = ReturnType<typeof buildRoastingProjection>;
