import DataLoader from 'dataloader';

import { RoastingModule } from '../../modules/roasting/roasting-contracts';
import { SalesModule } from '../../modules/sales/sales-contracts';

export const buildDataLoaders = (context: {
  roastingModule: RoastingModule;
  salesModule: SalesModule;
}) => {
  const resolveOrder = async (order: any) => {
    const roasting = await context.roastingModule.getRoastingByOrder({
      orderId: order.id,
    });

    return {
      ...order,
      roastingId: roasting?._id,
      roastingDate: roasting?.roastingDate,
    };
  };

  // const orderLoader = new DataLoader(async (keys: readonly number[]) => {
  //   const orders = await context.salesModule.getOrdersByIds(keys as number[]);
  //   return orders.map(resolveOrder);
  // });

  return { resolveOrder };
};

export type DataLoaders = ReturnType<typeof buildDataLoaders>;
