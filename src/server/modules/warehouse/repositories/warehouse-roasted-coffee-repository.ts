import { model, Schema, Document } from 'mongoose';

import { Logger } from '../../../../shared/logger';
import { WarehouseRoastedCoffeeEntity } from '../entities/warehouse-roasted-coffee-entity';
import {
  WarehouseRoastedCoffeeRepository,
  WarehouseRoastingEvent,
} from '../warehouse-contracts';
import { Message, MessageBroker } from './../../../services/message-broker';

const SCHEMA_VERSION = 1;
const EVENTS_LIMIT_PER_DOCUMENT = 1000;
const MESSAGE_STREAM = 'warehouse-events';

export interface WarehouseRoastedCoffeeDocument extends Document {
  schemaVersion: number;
  startEventPosition: number;
  endEventPosition: number;

  roastedCoffeeId: string;
  currentState: {
    quantityOnHand: number;
    version: number;
  };
  events: WarehouseRoastingEvent[];
}

const schema = new Schema({
  schemaVersion: {
    type: Number,
    default: SCHEMA_VERSION,
    required: true,
  },
  startEventPosition: Number,
  endEventPosition: Number,
  roastedCoffeeId: String,
  currentState: {
    quantityOnHand: Number,
    version: Number,
  },
  events: [Object],
});

const MongooseModel = model<WarehouseRoastedCoffeeDocument>(
  'warehouseRoastedCoffee',
  schema
);

export const buildWarehouseRoastedCoffeeRepository = (context: {
  messageBroker: MessageBroker;
}): WarehouseRoastedCoffeeRepository => {
  return {
    getOne: async (id: string) => {
      const lastDocument = await MongooseModel.findOne({
        roastedCoffeeId: id,
      }).sort({ startEventPosition: -1 });

      if (!lastDocument) {
        return;
      }

      return WarehouseRoastedCoffeeEntity.create({
        id,
        currentState: lastDocument.currentState,
        events: lastDocument.events,
      });
    },
    save: async (entity: WarehouseRoastedCoffeeEntity) => {
      const start = Date.now();
      Logger.debug(`Processing repository save for entity`, entity.id);
      const lastDocument = await MongooseModel.findOne({
        roastedCoffeeId: entity.id,
      }).sort({ startEventPosition: -1 });

      let databaseHandler: Promise<unknown>;
      if (!lastDocument) {
        databaseHandler = MongooseModel.create({
          startEventPosition: entity.getCurrentState().version - 1,
          endEventPosition: entity.getCurrentState().version - 1,
          roastedCoffeeId: entity.id,
          currentState: entity.getCurrentState(),
          events: [...entity.events, ...entity.uncommittedEvents],
        });
      } else if (
        entity.getCurrentState().version - lastDocument.startEventPosition >
        EVENTS_LIMIT_PER_DOCUMENT
      ) {
        databaseHandler = MongooseModel.create({
          startEventPosition: lastDocument.endEventPosition,
          endEventPosition: entity.getCurrentState().version - 1,
          roastedCoffeeId: entity.id,
          currentState: entity.getCurrentState(),
          events: entity.uncommittedEvents,
        });
        return;
      } else {
        databaseHandler = MongooseModel.updateOne(
          { _id: lastDocument._id },
          {
            endEventPosition: entity.getCurrentState().version - 1,
            currentState: entity.getCurrentState(),
            events: [...entity.events, ...entity.uncommittedEvents],
          }
        ).exec();
      }

      await databaseHandler;
      Logger.debug(`Save process finished`);
      Logger.debug(`Publishing domain events`);

      //TODO this should be done via OUTBOX pattern, save the unpublished messages to database
      // in the same transaction and them poll them in the publisher and publish
      // Right now this can potentially fail without notifying other parts of the system
      await Promise.all(
        entity.uncommittedEvents.map((event: Message<unknown>) => {
          return context.messageBroker.publishMessage(MESSAGE_STREAM, event);
        })
      );
      Logger.debug(`Domain events published`);
      Logger.debug(
        `Repository save finished, it took ${Date.now() - start} ms`
      );
    },
    exists: async (id: string) => {
      return MongooseModel.exists({
        roastedCoffeeId: id,
      });
    },
    getEventsForEntity: async (id: string) => {
      const doc = await MongooseModel.find({
        roastedCoffeeId: id,
      }).limit(2);
      return doc.flatMap((item) => item.events);
    },
  };
};
