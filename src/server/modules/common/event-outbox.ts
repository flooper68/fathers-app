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

@Injectable()
export class EventOutbox<S extends { uuid: string }> {
  private _queue = new PromiseQueue(1, Infinity);
  private _models: Model<AggregateRootDocument<S>>[] = [];

  registerOutbox(model: Model<AggregateRootDocument<S>>) {
    this._models.push(model);
  }

  private async handleCheckout() {
    Logger.debug(`Checking out outbox`);
    try {
      await Promise.all(
        this._models.map(async (model) => {
          const docs = await model
            .find({ 'outbox.0': { $exists: true } })
            .sort({ position: 1 });

          Logger.debug(`Found ${docs.length} docs with events in outbox`);

          for (const doc of docs) {
            await runPromisesInSequence(doc.outbox, async (event, index) => {
              Logger.debug(`Publishing event position ${event.position}`);
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
  }

  private enqueueCheckout = _.debounce(
    () => this._queue.add(() => this.handleCheckout()),
    100
  );

  checkout() {
    this.enqueueCheckout();
  }
}
