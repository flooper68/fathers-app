import { WarehouseProjection } from './../../projections/warehouse-projection';
import { DataLoaders } from './../data-loaders/data-loaders';
import moment from 'moment';

import { WarehouseModule } from './../../modules/warehouse/warehouse-contracts';
import { Logger } from '../../../shared/logger';
import {
  RoastingLeftoversAdded,
  RoastingLeftOversAddedType,
} from '../../modules/warehouse/events/roasting-leftover-added';
import {
  RoastingLeftoversUsed,
  RoastingLeftOversUsedType,
} from '../../modules/warehouse/events/roasting-leftover-used';
import {
  RoastingLeftoversAdjusted,
  RoastingLeftOversAdjustedType,
} from '../../modules/warehouse/events/roasting-leftover-adjusted';

export const buildWarehouseResolvers = (context: {
  warehouseModule: WarehouseModule;
  warehouseProjection: WarehouseProjection;
  dataLoaders: DataLoaders;
}) => {
  const adjustRoastingLeftovers = async (args: {
    roastedCoffeeId: string;
    newAmount: number;
  }) => {
    try {
      await context.warehouseModule.adjustRoastedCoffeeLeftovers({
        roastedCoffeeId: args.roastedCoffeeId,
        newAmount: args.newAmount,
        timestamp: moment().toISOString(),
      });
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

  const useRoastedCoffeeLeftovers = async (args: {
    roastedCoffeeId: string;
    amount: number;
  }) => {
    try {
      await context.warehouseModule.useRoastedCoffeeLeftovers({
        roastedCoffeeId: args.roastedCoffeeId,
        amount: args.amount,
        timestamp: moment().toISOString(),
      });
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

  const warehouseRoastedCoffees = async () => {
    try {
      const rootQuery = await context.warehouseProjection.getWarehouseRoastedCoffees();
      return rootQuery.map((item) => ({
        roastedCoffeeId: item.roastedCoffeeId,
        roastedCoffeeName: async () =>
          (
            await context.dataLoaders.roastedCoffeeLoader.load(
              item.roastedCoffeeId
            )
          ).name,
        quantityOnHand: item.quantityOnHand,
        lastUpdateReason: item.lastUpdateReason,
        lastUpdated: item.lastUpdated,
        history: async () => {
          const events = await context.warehouseModule.getRoastedCoffeeHistory({
            roastedCoffeeId: item.roastedCoffeeId,
          });
          return events.map((event) => {
            if (event.type === RoastingLeftOversAddedType) {
              return {
                type: (<RoastingLeftoversAdded>event).type,
                timestamp: (<RoastingLeftoversAdded>event).payload.timestamp,
                amount: (<RoastingLeftoversAdded>event).payload.amount,
              };
            }

            if (event.type === RoastingLeftOversUsedType) {
              return {
                type: (<RoastingLeftoversUsed>event).type,
                timestamp: (<RoastingLeftoversUsed>event).payload.timestamp,
                amount: (<RoastingLeftoversUsed>event).payload.amount,
              };
            }

            if (event.type === RoastingLeftOversAdjustedType) {
              return {
                type: (<RoastingLeftoversAdjusted>event).type,
                timestamp: (<RoastingLeftoversAdjusted>event).payload.timestamp,
                amount: (<RoastingLeftoversAdjusted>event).payload.newAmount,
              };
            }

            throw new Error(`Unknown event type`);
          });
        },
      }));
    } catch (e) {
      Logger.error(`Error handling createRoasting mutation`, e);
      return {
        success: false,
      };
    }
  };

  return {
    adjustRoastingLeftovers,
    useRoastedCoffeeLeftovers,
    warehouseRoastedCoffees,
  };
};
