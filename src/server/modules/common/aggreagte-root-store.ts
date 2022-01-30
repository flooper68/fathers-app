import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { v4 } from 'uuid';

import { Logger } from '../../../shared/logger';
import { assertExistence } from './assert-existence';
import { ApplicationError } from './errors';

interface WithUuid {
  uuid: string;
}

interface AggregateRoot<S extends WithUuid, E> {
  getState(): S;
  getEvents(): E[];
}

export interface AggregateRootDocument<S extends WithUuid> extends Document {
  schemaVersion: number;

  startEventPosition: number;
  endEventPosition: number;
  position: number;
  dataVersion: number;

  uuid: string;
  state: S;

  events: E[];
  outbox: E[];
}

export class ConcurrencyError extends Error {
  message = 'ConcurrencyError';
  constructor() {
    super();
  }
}

export interface OptimisticTransaction {
  uuid: string;
}

interface RunningOptimisticTransaction<S extends WithUuid> {
  uuid: string;
  document?: AggregateRootDocument<S>;
}

@Injectable()
export class AggregateRootStore<S extends WithUuid, E> {
  private _runningTransactions: Record<
    string,
    RunningOptimisticTransaction<S>
  > = {};

  private createNewBucket =
    (model: Model<AggregateRootDocument<S>>, schemaVersion: number) =>
    async (state: S) => {
      Logger.info(`Creating first bucket for new entity`);
      const result = await model.updateOne(
        { _id: `${state.uuid}_${0}` },
        {
          $setOnInsert: {
            _id: `${state.uuid}_${0}`,
            schemaVersion: schemaVersion,
            startEventPosition: 0,
            endEventPosition: 0,
            dataVersion: 0,
            position: 0,
            uuid: state.uuid,
            events: [],
            outbox: [],
          },
        },
        { upsert: true }
      );

      if (!result.upserted) {
        throw new Error(`Entity already exists`);
      }

      return assertExistence(
        await model.findOne({
          _id: `${state.uuid}_${0}`,
        })
      );
    };

  private handleBucketSize =
    (
      model: Model<AggregateRootDocument<S>>,
      schemaVersion: number,
      eventCountLimit: number
    ) =>
    async (
      document: AggregateRootDocument<S>
    ): Promise<AggregateRootDocument<S>> => {
      if (
        document.endEventPosition - document.startEventPosition >=
        eventCountLimit
      ) {
        Logger.info(
          `Over the event limit ${document.startEventPosition} ${document.endEventPosition}, creating new bucket`
        );
        const result = await model.updateOne(
          {
            _id: `${document.uuid}_${document.position + 1}`,
          },
          {
            $setOnInsert: {
              _id: `${document.uuid}_${document.position + 1}`,
              schemaVersion: schemaVersion,
              startEventPosition: document.endEventPosition,
              endEventPosition: document.endEventPosition,
              position: document.position + 1,
              uuid: document.uuid,
              state: document.state as never,
              dataVersion: 0,
              events: [],
              outbox: [],
            },
          },
          { upsert: true }
        );

        if (!result.upserted) {
          Logger.info(
            `New bucket created with startPosition ${document.endEventPosition}`
          );
        }

        return assertExistence(
          await model
            .findOne({
              uuid: document.uuid,
            })
            .sort({ position: -1 })
        );
      }

      return document;
    };

  getLatestBucket =
    (
      model: Model<AggregateRootDocument<S>>,
      schemaVersion: number,
      eventCountLimit: number
    ) =>
    async (
      uuid: string,
      transaction?: OptimisticTransaction
    ): Promise<AggregateRootDocument<S>> => {
      let document: AggregateRootDocument<S> | null = await model
        .findOne({
          uuid: uuid,
        })
        .sort({ position: -1 });

      if (!document) {
        throw new Error(`Entity not found`);
      }

      document = await this.handleBucketSize(
        model,
        schemaVersion,
        eventCountLimit
      )(document);

      if (transaction) {
        if (!this._runningTransactions[transaction.uuid]) {
          throw new ApplicationError(`No transaction started`);
        }

        this._runningTransactions[transaction.uuid] = {
          uuid: transaction.uuid,
          document,
        };
      }

      return document;
    };

  save =
    (model: Model<AggregateRootDocument<S>>, schemaVersion: number) =>
    async (
      aggregateRoot: AggregateRoot<S, E>,
      transaction: OptimisticTransaction
    ): Promise<void> => {
      const state = aggregateRoot.getState();

      if (!this._runningTransactions[transaction.uuid]) {
        throw new ApplicationError(`No transaction started`);
      }

      let document: AggregateRootDocument<S>;

      if (!this._runningTransactions[transaction.uuid].document) {
        Logger.debug(`There is no fetched entity, assuming entity creation`);
        document = await this.createNewBucket(model, schemaVersion)(state);
      } else {
        document = assertExistence(
          this._runningTransactions[transaction.uuid].document
        );
      }

      const result = await model.updateOne(
        {
          _id: `${state.uuid}_${document.position}`,
          dataVersion: document.dataVersion,
          startEventPosition: document.startEventPosition,
        },
        {
          endEventPosition:
            document.endEventPosition + aggregateRoot.getEvents().length,
          state: state as never,
          dataVersion: document.dataVersion + 1,
          $push: {
            events: aggregateRoot.getEvents().map((event, index) => ({
              ...event,
              position: document.endEventPosition + index,
              correlationUuid: v4(),
            })),
            outbox: aggregateRoot.getEvents(),
          },
        }
      );

      if (result.n !== 1) {
        throw new ConcurrencyError();
      }
    };

  useModel = (
    model: Model<AggregateRootDocument<S>>,
    schemaVersion: number,
    eventCountLimit: number
  ) => {
    return {
      get: this.getLatestBucket(model, schemaVersion, eventCountLimit),
      save: this.save(model, schemaVersion),
    };
  };

  async withTranscation<T>(
    work: (transaction: OptimisticTransaction) => Promise<T>
  ) {
    const start = Date.now();
    const transactionUuid = v4();

    this._runningTransactions[transactionUuid] = { uuid: transactionUuid };

    let success = false;
    let tries = 1;

    while (!success) {
      try {
        await work(this._runningTransactions[transactionUuid]);
        success = true;
        delete this._runningTransactions[transactionUuid];
      } catch (e) {
        if (e?.message === 'ConcurrencyError') {
          tries++;
        } else {
          Logger.debug(`Optimistic Transaction ${transactionUuid} failed`);
          delete this._runningTransactions[transactionUuid];
          throw e;
        }
      }
    }

    Logger.debug(
      `Optimistic Transaction ${transactionUuid} finished after ${tries} tries, it took ${
        Date.now() - start
      } ms`
    );
  }
}
