import { Model, model, Schema } from 'mongoose';
import PromiseQueue from 'promise-queue';

import { Logger } from '../../../shared/logger';
import { MessageBroker } from './message-broker';

export interface ConsumerDocument<S> extends Document {
  _id: string;
  schemaVersion: number;
  dataVersion: number;
  nextPosition: number;
  state: S;
}

const _schema = new Schema({
  _id: String,
  schemaVersion: {
    type: Number,
    required: true,
  },
  dataVersion: Number,
  nextPosition: Number,
  state: Object,
});

interface Config<S, E> {
  name: string;
  stream: string;
  initialState: S;
  reducer: (state: S, event: E) => S;
}

export class Consumer<S, E> {
  private _queue = new PromiseQueue(1, Infinity);
  private _nextPosition = 0;
  private _model: Model<ConsumerDocument<S>>;

  private _config: Config<S, E> | null = null;

  constructor(
    private readonly broker: MessageBroker,
    config: {
      name: string;
      stream: string;
      initialState: S;
      reducer: (state: S, event: E) => S;
    }
  ) {
    this._config = config;
    this._model = model<ConsumerDocument<S>>(config.name, _schema);
  }

  listen() {
    this.catchUp();
  }

  private catchUp = async () => {
    if (!this._config) {
      throw new Error();
    }

    const doc = await this._model.findOne().sort({ nextPosition: 1 });

    if (doc) {
      this._nextPosition = doc.nextPosition;
    }

    let nextEvent = true;
    while (nextEvent) {
      nextEvent = await this.handleEvent();
    }

    Logger.debug(`Catch up finished, subscribing to new events`);

    this.broker.subscribe(this._config.stream, () => {
      this.handleEvent();
    });
  };

  private async handleNextEvent(): Promise<boolean> {
    if (!this._config) {
      throw new Error();
    }

    const event = await this.broker.getMessage(
      this._config.stream,
      this._nextPosition
    );

    if (!event) {
      Logger.debug(`No next event, finished`);
      return false;
    }

    let doc = await this._model.findOne({ _id: event.rootUuid });

    if (!doc) {
      await this._model.updateOne(
        { _id: event.rootUuid },
        {
          $setOnInsert: {
            nextPosition: 1,
            dataVersion: 1,
            state: this._config.initialState as never,
          },
        },
        { upsert: true }
      );
      doc = await this._model.findOne({ _id: event.rootUuid });
    }

    const state = this._config.reducer(
      doc?.state || this._config.initialState,
      event
    );

    await this._model.updateOne(
      { _id: event.rootUuid },
      {
        state: state as never,
        nextPosition: this._nextPosition + 1,
        dateVersion: (doc?.dataVersion || 0) + 1,
      }
    );
    this._nextPosition++;
    Logger.debug(
      `Event ${event.correlationUuid} consumed in ${this._config.name}`
    );
    return true;
  }

  private handleEvent = () => {
    return this._queue.add(() => this.handleNextEvent());
  };

  get model() {
    return this._model;
  }
}
