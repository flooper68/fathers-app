import DataLoader from 'dataloader';

import { WarehouseProjection } from './../../projections/warehouse-projection';
import { RoastingModule } from '../../modules/roasting/roasting-contracts';
import { SalesModule } from '../../modules/sales/sales-contracts';

export const buildDataLoaders = (context: {
  roastingModule: RoastingModule;
  salesModule: SalesModule;
  warehouseProjection: WarehouseProjection;
}) => {
  const warehouseRoastedCoffeeLoader = new DataLoader(
    async (keys: readonly number[]) => {
      return context.warehouseProjection.getWarehouseRoastedCoffeeByIds(
        keys as number[]
      );
    }
  );

  const roastedCoffeeLoader = new DataLoader(
    async (keys: readonly string[]) => {
      //There is few of them, works for now, we will refactor this if needed
      const items = await context.roastingModule.getAllRoastedCoffees();
      return items.filter((item) => keys.includes(item.id));
    }
  );

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

  return { resolveOrder, roastedCoffeeLoader, warehouseRoastedCoffeeLoader };
};

export type DataLoaders = ReturnType<typeof buildDataLoaders>;
