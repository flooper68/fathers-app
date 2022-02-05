import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { Model } from 'mongoose';
import PromiseQueue from 'promise-queue';

import { Logger } from '../../../shared/logger';
import {
  AggregateRootDocument,
  ConcurrencyError,
} from './aggreagte-root-store';
import { runPromisesInSequence } from './../../services/promise-utils';
import { MessageBroker } from './message-broker';
import { withAwaitedEllapsedTime } from './with-ellapsed-time';

@Injectable()
export class EventOutbox<S extends { uuid: string }> {
  private _queue = new PromiseQueue(1, Infinity);
  private _models: Model<AggregateRootDocument<S>>[] = [];
  private _listening = false;

  constructor(private readonly broker: MessageBroker) {
    setInterval(() => {
      this.checkout();
    }, 2000);
  }

  registerOutbox(model: Model<AggregateRootDocument<S>>) {
    this._models.push(model);
  }

  private checkOutbox = withAwaitedEllapsedTime(async () => {
    Logger.debug(`Checking out outbox`);
    try {
      await Promise.all(
        this._models.map(async (model) => {
          const docs = await model
            .find({ 'outbox.0': { $exists: true } })
            .sort({ position: 1 });

          for (const doc of docs) {
            await runPromisesInSequence(doc.outbox, async (event, index) => {
              await Promise.all(
                doc.streams.map((stream) =>
                  this.broker.publishEvent(stream, event)
                )
              );

              const result = await model.updateOne(
                { _id: doc._id, dataVersion: doc.dataVersion + index },
                {
                  $pull: {
                    outbox: {
                      correlationUuid: event.correlationUuid,
                    },
                  },
                  dataVersion: doc.dataVersion + index + 1,
                }
              );
              if (result.n === 0) {
                Logger.warn(`Outbox did not update, doc was used`);
                throw new ConcurrencyError();
              }
            });
          }
        })
      );
    } catch (e) {
      if (e.message === 'ConcurrencyError') {
        this.enqueueCheckout();
      }
    }
  }, 'checkOutbox');

  private enqueueCheckout = _.throttle(
    () => this._queue.add(() => this.checkOutbox()),
    100
  );

  checkout() {
    if (!this._listening) {
      return;
    }
    this.enqueueCheckout();
  }

  listen() {
    this._listening = true;
  }
}