import PromiseQueue from 'promise-queue';
import { model, Schema, Document } from 'mongoose';

import { runPromisesInSequence } from './../services/promise-utils';
import {
  RoastingLeftoversAdded,
  RoastingLeftOversAddedType,
} from '../modules/warehouse/events/roasting-leftover-added';
import {
  RoastingLeftoversAdjusted,
  RoastingLeftOversAdjustedType,
} from '../modules/warehouse/events/roasting-leftover-adjusted';
import {
  RoastingLeftoversUsed,
  RoastingLeftOversUsedType,
} from '../modules/warehouse/events/roasting-leftover-used';
import { Logger } from './../../shared/logger';
import {
  DomainEvent,
  MessageBroker,
  OrderedMessage,
} from '../modules/common/contracts';
import { WAREHOUSE_ROASTED_COFFEE_MESSAGE_STREAM } from '../modules/warehouse/warehouse-contracts';

interface WarehouseRoastedCofffeProjection {
  roastedCoffeeId: string;
  quantityOnHand: number;
  lastUpdated?: string;
  lastUpdateReason?: string;
}

const SCHEMA_VERSION = 1;

interface WarehouseRoastedCofffeProjectionDocument
  extends Document,
    WarehouseRoastedCofffeProjection {
  schemaVersion: number;
  position: number;
}

const schema = new Schema({
  schemaVersion: {
    type: Number,
    default: SCHEMA_VERSION,
    required: true,
  },
  roastedCoffeeId: String,
  quantityOnHand: Number,
  lastUpdated: String,
  lastUpdateReason: String,
  position: Number,
});

const MongooseModel = model<WarehouseRoastedCofffeProjectionDocument>(
  'warehouse-roasted-coffee-projection',
  schema
);

export const buildWarehouseProjection = (context: {
  messageBroker: MessageBroker;
}) => {
  let lastPosition = -1;
  //Due to nature of mongo, we need single writer pattern to keep ordering
  const processingQueue = new PromiseQueue(1, Infinity);

  const reduceRoastedCoffee = (
    state: WarehouseRoastedCofffeProjection,
    event: DomainEvent<unknown>
  ) => {
    switch (event.type) {
      case RoastingLeftOversAddedType: {
        const payload = (<RoastingLeftoversAdded>event).payload;
        return {
          ...state,
          quantityOnHand: state.quantityOnHand + payload.amount,
          lastUpdated: payload.timestamp,
          lastUpdateReason: event.type,
        };
      }
      case RoastingLeftOversUsedType: {
        const payload = (<RoastingLeftoversUsed>event).payload;
        return {
          ...state,
          quantityOnHand: state.quantityOnHand - payload.amount,
          lastUpdated: payload.timestamp,
          lastUpdateReason: event.type,
        };
      }
      case RoastingLeftOversAdjustedType: {
        const payload = (<RoastingLeftoversAdjusted>event).payload;
        return {
          ...state,
          quantityOnHand: payload.newAmount,
          lastUpdated: payload.timestamp,
          lastUpdateReason: event.type,
        };
      }
      default:
        Logger.debug(
          `${event.type} not handled by warehouse projection, falling through`
        );
        return state;
    }
  };

  const processEvent = async (event: OrderedMessage<unknown>) => {
    Logger.info(`Processing new event for warehouse projection`, event);
    if (lastPosition + 1 !== event.position) {
      Logger.error(`Missing events in projection`, event, lastPosition);
      throw new Error(`Missing events in projection`);
    }

    const id = (event.payload as { roastedCoffeeId: string }).roastedCoffeeId;

    const doc = await MongooseModel.findOne({ roastedCoffeeId: id });
    if (!doc) {
      const projection = reduceRoastedCoffee(
        {
          roastedCoffeeId: id,
          quantityOnHand: 0,
        },

        event
      );
      await MongooseModel.create({ ...projection, position: event.position });
    } else {
      const projection = reduceRoastedCoffee(doc.toObject(), event);
      await MongooseModel.updateOne(
        { _id: doc._id },
        { ...projection, position: event.position }
      );
    }
    lastPosition = event.position;
  };

  const addEventForProcessing = async (event: OrderedMessage<unknown>) => {
    Logger.info(`Adding event for processing for warehouse projection`, event);
    return processingQueue.add(() => processEvent(event));
  };

  const recalculateFromLast = async () => {
    let messages = await context.messageBroker.getMessagesFrom(
      WAREHOUSE_ROASTED_COFFEE_MESSAGE_STREAM,
      lastPosition + 1,
      100
    );

    while (messages.length !== 0) {
      await runPromisesInSequence(messages, addEventForProcessing);
      messages = await context.messageBroker.getMessagesFrom(
        WAREHOUSE_ROASTED_COFFEE_MESSAGE_STREAM,
        lastPosition + 1,
        100
      );
    }
  };

  const init = async () => {
    const lastDoc = await MongooseModel.findOne().sort({ position: -1 });
    lastPosition = lastDoc?.position || -1;
    await recalculateFromLast();
    Logger.debug(
      `Warehouse projection has caught up, subscribing to new events`
    );
    context.messageBroker.consumeAll(
      WAREHOUSE_ROASTED_COFFEE_MESSAGE_STREAM,
      addEventForProcessing
    );
  };

  const getWarehouseRoastedCoffee = async (
    id: string
  ): Promise<WarehouseRoastedCofffeProjection | undefined> => {
    const doc = await MongooseModel.findOne({ roastedCoffeeId: id });
    if (!doc) {
      return;
    }
    return {
      roastedCoffeeId: doc.roastedCoffeeId,
      quantityOnHand: doc.quantityOnHand,
      lastUpdateReason: doc.lastUpdateReason,
      lastUpdated: doc.lastUpdated,
    };
  };

  const getWarehouseRoastedCoffees = async (): Promise<
    WarehouseRoastedCofffeProjection[]
  > => {
    const doc = await MongooseModel.find();
    return doc.map((doc) => {
      return {
        roastedCoffeeId: doc.roastedCoffeeId,
        quantityOnHand: doc.quantityOnHand,
        lastUpdateReason: doc.lastUpdateReason,
        lastUpdated: doc.lastUpdated,
      };
    });
  };

  const getWarehouseRoastedCoffeeByIds = async (
    ids: number[]
  ): Promise<WarehouseRoastedCofffeProjection[]> => {
    const doc = await MongooseModel.find({ id: { $in: ids } });
    return doc.map((doc) => {
      return {
        roastedCoffeeId: doc.roastedCoffeeId,
        quantityOnHand: doc.quantityOnHand,
        lastUpdateReason: doc.lastUpdateReason,
        lastUpdated: doc.lastUpdated,
      };
    });
  };

  return {
    init,
    getWarehouseRoastedCoffee,
    getWarehouseRoastedCoffees,
    getWarehouseRoastedCoffeeByIds,
  };
};

export type WarehouseProjection = ReturnType<typeof buildWarehouseProjection>;
