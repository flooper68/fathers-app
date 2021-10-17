import { DataLoaders } from './../data-loaders/data-loaders';
import { RoastingProjection } from '../../projections/roasting-projection';
import { SalesModule } from './../../modules/sales/sales-contracts';
import { RoastingModule } from '../../modules/roasting/roasting-contracts';

export const buildRoastingResolvers = (context: {
  roastingModule: RoastingModule;
  salesModule: SalesModule;
  dataLoaders: DataLoaders;
  roastingProjection: RoastingProjection;
}) => {
  const createRoastingResolver = async (args: { date: string }) => {
    await context.roastingModule.createRoasting({ roastingDate: args.date });
    return {
      success: true,
    };
  };

  const selectOrdersRoastingResolver = async (props: {
    orderId: number;
    roastingId: string;
  }) => {
    await context.roastingModule.selectOrdersRoasting(props);
    return {
      success: true,
    };
  };

  const startRoastingResolver = async () => {
    await context.roastingModule.startRoasting();
    return {
      success: true,
    };
  };

  const finishBatchResolver = async (args: { roastedCoffeeId: string }) => {
    await context.roastingModule.finishBatch({
      roastedCoffeeId: args.roastedCoffeeId,
    });
    return {
      success: true,
    };
  };

  const reportRealYieldResolver = async (args: {
    roastedCoffeeId: string;
    weight: number;
  }) => {
    await context.roastingModule.reportRealYield(args);
    return {
      success: true,
    };
  };

  const finishRoastingResolver = async () => {
    await context.roastingModule.finishRoasting();
    return {
      success: true,
    };
  };

  const getRoastingsResolver = async () => {
    const roastings = await context.roastingModule.getAllRoastings();
    return roastings.map(async (item) => {
      const projection = await context.roastingProjection.getFullProjection(
        item
      );
      const orders = await context.salesModule.getOrdersByIds(
        projection.orders
      );

      return {
        ...projection,
        orders: orders.map(context.dataLoaders.resolveOrder),
      };
    });
  };

  return {
    createRoastingResolver,
    selectOrdersRoastingResolver,
    startRoastingResolver,
    finishBatchResolver,
    finishRoastingResolver,
    reportRealYieldResolver,
    getRoastingsResolver,
  };
};
