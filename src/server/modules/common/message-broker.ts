import { Injectable } from '@nestjs/common';
import { model, Schema } from 'mongoose';
import { filter, Subject } from 'rxjs';

import { ConcurrencyError } from './aggreagte-root-store';
import { assertExistence } from './assert-existence';
import { Logger } from '../../../shared/logger';
import { withAwaitedEllapsedTime } from './with-ellapsed-time';

export interface EventBucketDocument extends Document {
  schemaVersion: number;

  startEventPosition: number;
  endEventPosition: number;
  position: number;
  dataVersion: number;

  uuid: string;

  events: unknown[];
}

const eventStreamSchema = new Schema({
  _id: String,
  schemaVersion: {
    type: Number,
    required: true,
  },
  startEventPosition: Number,
  endEventPosition: Number,
  position: Number,
  dataVersion: Number,

  uuid: String,

  events: [Object],
});

const SCHEMA_VERSION = 1;
const BUCKET_SIZE_LIMIT = 1000;

const eventStreamModel = model(`event-stream`, eventStreamSchema);

@Injectable()
export class MessageBroker {
  private _subject = new Subject();

  private createNewBucket = async (uuid: string) => {
    Logger.debug(`New bucket for event-stream created`);
    await eventStreamModel.updateOne(
      { _id: `${uuid}_${0}` },
      {
        $setOnInsert: {
          _id: `${uuid}_${0}`,
          schemaVersion: SCHEMA_VERSION,
          startEventPosition: 0,
          endEventPosition: 0,
          dataVersion: 0,
          position: 0,
          uuid: uuid,
          events: [],
        },
      },
      { upsert: true }
    );

    return assertExistence(
      await eventStreamModel.findOne({
        _id: `${uuid}_${0}`,
      })
    );
  };

  private handleBucketSize = async (
    document: EventBucketDocument
  ): Promise<EventBucketDocument> => {
    if (
      document.endEventPosition - document.startEventPosition >=
      BUCKET_SIZE_LIMIT
    ) {
      Logger.info(
        `Over the event limit ${document.startEventPosition} ${document.endEventPosition}, creating new bucket`
      );
      await eventStreamModel.updateOne(
        {
          _id: `${document.uuid}_${document.position + 1}`,
        },
        {
          $setOnInsert: {
            _id: `${document.uuid}_${document.position + 1}`,
            schemaVersion: SCHEMA_VERSION,
            startEventPosition: document.endEventPosition,
            endEventPosition: document.endEventPosition,
            position: document.position + 1,
            uuid: document.uuid,
            dataVersion: 0,
            events: [],
          },
        },
        { upsert: true }
      );

      return assertExistence(
        await eventStreamModel
          .findOne({
            uuid: document.uuid,
          })
          .sort({ position: -1 })
      );
    }

    return document;
  };

  private handlePublish = async (
    uuid: string,
    event: { uuid: string }
  ): Promise<void> => {
    let document: EventBucketDocument | null = await eventStreamModel
      .findOne({
        uuid: uuid,
      })
      .sort({ position: -1 });

    if (!document) {
      document = await this.createNewBucket(uuid);
    }

    if (
      await eventStreamModel.exists({
        uuid: uuid,
        events: {
          $elemMatch: {
            uuid: event.uuid,
          },
        },
      })
    ) {
      Logger.debug(`Event ${event.uuid} already exists, skipping`);
      return;
    }

    document = await this.handleBucketSize(assertExistence(document));

    const result = await eventStreamModel.updateOne(
      {
        _id: `${uuid}_${document.position}`,
        dataVersion: document.dataVersion,
        startEventPosition: document.startEventPosition,
      },
      {
        endEventPosition: document.endEventPosition + 1,

        dataVersion: document.dataVersion + 1,
        $push: {
          events: { ...event, position: document.endEventPosition },
        },
      }
    );

    if (result.n !== 1) {
      throw new ConcurrencyError();
    }
  };

  publishEvent = withAwaitedEllapsedTime(
    async (uuid: string, event: { uuid: string }): Promise<void> => {
      let success = false;

      console.log(event);
      while (!success) {
        try {
          await this.handlePublish(uuid, event);
          success = true;
          this._subject.next(uuid);
        } catch (e) {
          if (e instanceof Error && e?.message !== 'ConcurrencyError') {
            Logger.error(`Event ${event.uuid} publish failed`, e);
            throw e;
          }
        } finally {
          Logger.info(`Event ${event.uuid} published to ${uuid}`);
        }
      }
    },
    'publishEvent'
  );

  getMessage = async (stream: string, messagePosition: number) => {
    const doc = await eventStreamModel.findOne({
      startEventPosition: { $lte: messagePosition },
      endEventPosition: { $gt: messagePosition },
      uuid: stream,
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

  subscribe = (streamName: string, callback: () => void) => {
    this._subject
      .pipe(filter((stream) => stream === streamName))
      .subscribe(callback);
  };
}
