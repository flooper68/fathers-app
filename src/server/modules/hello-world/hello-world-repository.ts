import { model, Schema } from 'mongoose';

import {
  AggregateRootDocument,
  AggregateRootStore,
  OptimisticTransaction,
} from '../common/aggreagte-root-store';
import { HelloWorldFactory } from './hello-world-factory';
import {
  HelloWorldAggregateRoot,
  HelloWorldDomainEvent,
  HelloWorldState,
} from './hello-world-root';

export type HelloWorldDocument = AggregateRootDocument<HelloWorldState>;

const schema = new Schema({
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
  state: Object,
  events: [Object],
  outbox: [Object],
});

export const TestModel = model<HelloWorldDocument>('hello-world', schema);

export class HelloWorldRepository {
  constructor(
    private readonly store: AggregateRootStore<
      HelloWorldState,
      HelloWorldDomainEvent
    >,
    private readonly factory: HelloWorldFactory,
    private readonly transaction: OptimisticTransaction
  ) {}

  async get(uuid: string) {
    const document = await this.store
      .useModel(TestModel, 1, 10)
      .get(uuid, this.transaction);
    return this.factory.hydrate(document.state, document.endEventPosition);
  }

  save(root: HelloWorldAggregateRoot) {
    return this.store.useModel(TestModel, 1, 10).save(root, this.transaction);
  }
}