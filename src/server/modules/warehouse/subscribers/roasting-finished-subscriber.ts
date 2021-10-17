import moment from 'moment';

import { WarehouseModule } from './../warehouse-contracts';
import { RoastingProjection } from './../../../projections/roasting-projection';
import {
  RoastingFinished,
  RoastingFinishedType,
} from '../../roasting/events/roasting-finished';
import { Logger } from '../../../../shared/logger';
import { MessageBroker } from '../../common/contracts';
import { ROASTING_MESSAGE_STREAM } from '../../roasting/roasting-contracts';

export const roastingFinishedSubscriber = (context: {
  messageBroker: MessageBroker;
  roastingProjection: RoastingProjection;
  warehouseModule: WarehouseModule;
}) => {
  context.messageBroker.consumeMessage(
    ROASTING_MESSAGE_STREAM,
    RoastingFinishedType,
    //TODO this should be idempotent so the system can handle receiving the same message twice
    async (event: RoastingFinished) => {
      Logger.debug(`Warehouse received RoastingFinished - handling use case`);

      // TODO This can fail and the whole message will than fail, this should be added to the roasting entity itself
      // and the event should already have the leftovers calculated
      const roasting = await context.roastingProjection.getFullProjection(
        event.payload
      );

      const leftOvers = roasting.finishedBatches.map((roastedCoffeeBatches) => {
        const roastedCoffee = roasting.roastedCoffee.find(
          (item) => item.id === roastedCoffeeBatches.roastedCoffeeId
        );

        if (!roastedCoffee) {
          throw new Error(`Missing entity roastedCoffee`);
        }

        const realYield = roasting.realYield.find(
          (item) =>
            item.roastedCoffeeId === roastedCoffeeBatches.roastedCoffeeId
        );

        if (!realYield) {
          throw new Error(`Missing entity realYield`);
        }

        return {
          amount: realYield.weight - roastedCoffee.weight,
          roastedCoffeeId: roastedCoffee.id,
        };
      });

      const timestamp = moment().toISOString();

      for (const item of leftOvers) {
        // TODO This can potentially fail for some of the leftovers, leaving the state inconsistent,
        // however, this is okay for the bussiness, as the measuring is not precise and amounts are
        // readjusted often
        await context.warehouseModule.addRoastingLeftovers({
          ...item,
          timestamp,
          roastingId: roasting.id,
        });
      }
    }
  );
};
