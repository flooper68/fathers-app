import { DataLoaders } from './../data-loaders/data-loaders';
import { RoastingProjection } from '../../projections/roasting-projection';
import { SalesModule } from './../../modules/sales/sales-contracts';
import { Logger } from '../../../shared/logger';
import { RoastingModule } from '../../modules/roasting/roasting-contracts';

export const buildRoastingResolvers = (context: {
  roastingModule: RoastingModule;
  salesModule: SalesModule;
  dataLoaders: DataLoaders;
  roastingProjection: RoastingProjection;
}) => {
  const createRoastingResolver = async (args: { date: string }) => {
    try {
      await context.roastingModule.createRoasting({ roastingDate: args.date });
      return {
        success: true,
      };
    } catch (e) {
      Logger.error(`Error handling createRoasting mutation`, e);
      return {
        success: false,
      };
    }
  };

  const selectOrdersRoastingResolver = async (props: {
    orderId: number;
    roastingId: string;
  }) => {
    try {
      await context.roastingModule.selectOrdersRoasting(props);
      return {
        success: true,
      };
    } catch (e) {
      Logger.error(`Error handling addOrderToRoasting mutation`, e);
      return {
        success: false,
      };
    }
  };

  const startRoastingResolver = async () => {
    try {
      await context.roastingModule.startRoasting();
      return {
        success: true,
      };
    } catch (e) {
      Logger.error(`Error handling startRoasting mutation`, e);
      return {
        success: false,
      };
    }
  };

  const finishBatchResolver = async (args: { roastedCoffeeId: string }) => {
    try {
      await context.roastingModule.finishBatch({
        roastedCoffeeId: args.roastedCoffeeId,
      });
      return {
        success: true,
      };
    } catch (e) {
      Logger.error(`Error handling finishBatch mutation`, e);
      return {
        success: false,
      };
    }
  };

  const reportRealYieldResolver = async (args: {
    roastedCoffeeId: string;
    weight: number;
  }) => {
    try {
      await context.roastingModule.reportRealYield(args);
      return {
        success: true,
      };
    } catch (e) {
      Logger.error(`Error handling finishBatch mutation`, e);
      return {
        success: false,
      };
    }
  };

  const finishRoastingResolver = async () => {
    try {
      await context.roastingModule.finishRoasting();
      return {
        success: true,
      };
    } catch (e) {
      Logger.error(`Error handling finishRoasting mutation`, e);
      return {
        success: false,
      };
    }
  };

  const getRoastingsResolver = async () => {
    try {
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
    } catch (e) {
      Logger.error(`Error handling resolver`, e);
      return {
        success: false,
      };
    }
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
