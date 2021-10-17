import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { model, Schema, Document } from 'mongoose';
import PromiseQueue from 'promise-queue';

import { Logger } from '../../shared/logger';
import {
  Message,
  MessageBroker,
  OrderedMessage,
} from '../modules/common/contracts';

const SCHEMA_VERSION = 1;
const EVENTS_LIMIT_PER_DOCUMENT = 1000;

export interface MessageStreamDocument extends Document {
  schemaVersion: number;
  startEventPosition: number;
  endEventPosition: number;

  events: OrderedMessage<unknown>[];
}

const schema = new Schema({
  schemaVersion: {
    type: Number,
    default: SCHEMA_VERSION,
    required: true,
  },
  startEventPosition: Number,
  endEventPosition: Number,
  events: [Object],
});

const getStreamCollectionName = (stream: string) => `${stream}-event-store`;

//Just a dummy implementation so far, will use Kafka in future
// for now consumer replay is not in place is all of this is monolith
// no retries in play right now - maybe add Redis and Bull for this??
export const buildMessageBroker = (): MessageBroker => {
  const streams: Record<string, Subject<OrderedMessage<unknown>>> = {};
  //Just a single writer possible for given stream,
  // due to mongo transactions handled on the application level for now,
  const processingQueues: Record<string, PromiseQueue> = {};

  const processPublishMessage = async <Payload>(
    stream: string,
    message: Message<Payload>
  ) => {
    Logger.debug(`Processing publish message for stream ${stream}`, message);
    if (!streams[stream]) {
      streams[stream] = new Subject<OrderedMessage<unknown>>();
    }

    const MongooseModel = model<MessageStreamDocument>(
      getStreamCollectionName(stream),
      schema
    );
    const session = await MongooseModel.startSession();

    await session.withTransaction(async () => {
      const lastDocument = await MongooseModel.findOne().sort({
        startEventPosition: -1,
      });

      Logger.debug(`Last message position`, lastDocument?.endEventPosition);

      let orderedMessage: OrderedMessage<Payload>;

      let databaseHandler: Promise<unknown>;
      if (!lastDocument) {
        orderedMessage = { ...message, position: 0 };
        databaseHandler = MongooseModel.create({
          startEventPosition: 0,
          endEventPosition: 0,
          events: [orderedMessage],
        });
      } else if (
        lastDocument.endEventPosition - lastDocument.startEventPosition + 1 >
        EVENTS_LIMIT_PER_DOCUMENT
      ) {
        orderedMessage = {
          ...message,
          position: lastDocument.endEventPosition + 1,
        };
        databaseHandler = MongooseModel.create({
          startEventPosition: lastDocument.endEventPosition,
          endEventPosition: lastDocument.endEventPosition + 1,
          events: [orderedMessage],
        });
        return;
      } else {
        orderedMessage = {
          ...message,
          position: lastDocument.endEventPosition + 1,
        };
        databaseHandler = MongooseModel.updateOne(
          { _id: lastDocument._id },
          {
            endEventPosition: lastDocument.endEventPosition + 1,
            events: [...lastDocument.events, orderedMessage],
          }
        ).exec();
      }

      await databaseHandler;
      Logger.debug(`Publishing message`, orderedMessage);
      setTimeout(() => {
        streams[stream].next(orderedMessage);
      }, 0);
    });
    session.endSession();
  };

  const publishMessage = async <Payload>(
    stream: string,
    message: Message<Payload>
  ) => {
    const start = Date.now();
    Logger.debug(
      `Adding publish message for stream ${stream} for processing`,
      message
    );
    if (!processingQueues[stream]) {
      processingQueues[stream] = new PromiseQueue(1, Infinity);
    }
    await processingQueues[stream].add(() =>
      processPublishMessage(stream, message)
    );
    Logger.debug(`Message published, it took ${Date.now() - start} ms`);
  };

  const consumeMessage = <Payload>(
    stream: string,
    type: string,
    handler: (message: OrderedMessage<Payload>) => void
  ) => {
    if (!streams[stream]) {
      streams[stream] = new Subject<OrderedMessage<unknown>>();
    }
    (streams[stream] as Subject<OrderedMessage<Payload>>)
      .pipe(filter((message) => message.type === type))
      .subscribe(handler);
  };

  const consumeAll = <Payload>(
    stream: string,
    handler: (message: OrderedMessage<Payload>) => void
  ) => {
    if (!streams[stream]) {
      streams[stream] = new Subject<OrderedMessage<unknown>>();
    }

    (streams[stream] as Subject<OrderedMessage<Payload>>).subscribe(handler);
  };

  const getMessage = async (
    stream: string,
    messagePosition: number
  ): Promise<OrderedMessage<unknown> | undefined> => {
    const MongooseModel = model<MessageStreamDocument>(
      getStreamCollectionName(stream),
      schema
    );
    const doc = await MongooseModel.findOne({
      startEventPosition: { $lte: messagePosition },
      endEventPosition: { $gt: messagePosition },
    });

    if (!doc) {
      return;
    }

    const event = doc?.events[messagePosition - doc.startEventPosition];

    if (!event) {
      return;
    }

    return event || undefined;
  };

  const getMessagesFrom = async (
    stream: string,
    messagePosition: number,
    amount: number
  ): Promise<OrderedMessage<unknown>[]> => {
    if (amount > 2000) {
      throw new Error('Fetching two many messages at once');
    }

    const MongooseModel = model<MessageStreamDocument>(
      getStreamCollectionName(stream),
      schema
    );
    const docs = await MongooseModel.findOne({
      startEventPosition: { $lte: messagePosition },
      endEventPosition: { $gt: messagePosition },
    });

    const docsTwo = await MongooseModel.find({
      startEventPosition: { $gt: messagePosition },
      endEventPosition: { $lte: messagePosition + amount },
    });

    const docThree = await MongooseModel.findOne({
      startEventPosition: { $lte: messagePosition + amount },
      endEventPosition: { $gt: messagePosition + amount },
    });

    if (!docs) {
      return [];
    }

    const events: OrderedMessage<unknown>[] = [];

    events.push(
      ...docs?.events.slice(
        messagePosition - docs.startEventPosition,
        messagePosition - docs.startEventPosition + amount
      )
    );

    docsTwo.forEach((doc) => {
      events.push(...doc.events);
    });

    if (docThree) {
      events.push(
        ...docThree?.events.slice(
          messagePosition - docThree.startEventPosition,
          messagePosition - docThree.startEventPosition + amount
        )
      );
    }

    return events;
  };

  return {
    publishMessage,
    consumeMessage,
    consumeAll,
    getMessage,
    getMessagesFrom,
  };
};
