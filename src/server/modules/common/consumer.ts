import { model, Schema } from 'mongoose';
import PromiseQueue from 'promise-queue';

import { Logger } from '../../../shared/logger';
import { MessageBroker } from './message-broker';

const _schema = new Schema({
  _id: String,
  schemaVersion: {
    type: Number,
    required: true,
  },
  nextPosition: Number,
  dataVersion: Number,
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

  private _config: Config<S, E> | null = null;

  constructor(private readonly broker: MessageBroker) {
    setInterval(() => {
      this.catchUp();
    }, 1000);
  }

  listen(config: {
    name: string;
    stream: string;
    initialState: S;
    reducer: (state: S, event: E) => S;
  }) {
    this._config = config;
    this.catchUp();
  }

  private catchUp = async () => {
    if (!this._config) {
      throw new Error();
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
    const consumerModel = model(`consumer`, _schema);
    let doc = await consumerModel.findOne({ _id: this._config.name });

    if (!doc) {
      await consumerModel.updateOne(
        { _id: this._config.name },
        {
          $setOnInsert: {
            nextPosition: 1,
            dataVersion: 1,
            state: this._config.initialState,
          },
        },
        { upsert: true }
      );
      doc = await consumerModel.findOne({ _id: this._config.name });
    }

    const nextPosition = doc?.nextPosition || 0;

    const event = await this.broker.getMessage(
      this._config.stream,
      nextPosition
    );

    if (!event) {
      Logger.debug(`No next event, finished`, doc.state);
      return false;
    }

    const state = this._config.reducer(
      doc?.state || this._config.initialState,
      event
    );

    await consumerModel.updateOne(
      { _id: this._config.name },
      {
        state,
        nextPosition: nextPosition + 1,
        dateVersion: (doc?.dataVersion || 0) + 1,
      }
    );
    // Logger.info(
    //   `Event ${event.correlationUuid} consumed, new state, event ${nextPosition}`,
    //   state
    // );
    Logger.info(`- ${nextPosition}`);
    return true;
  }

  private handleEvent = () => {
    return this._queue.add(() => this.handleNextEvent());
  };
}
