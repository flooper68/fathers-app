import { Injectable } from '@nestjs/common';

import { AggregateRootStore } from '../common/aggreagte-root-store';
import { assertExistence } from '../common/assert-existence';
import { HelloWorldFactory } from './hello-world-factory';
import { HelloWorldRepository } from './hello-world-repository';
import {
  HelloWorldState,
  HelloWorldDomainEvent,
  HelloWorldAggregateRoot,
} from './hello-world-root';

interface Context {
  repository: HelloWorldRepository;
  factory: HelloWorldFactory;
}

@Injectable()
export class HelloWorldContext {
  constructor(
    private readonly store: AggregateRootStore<
      HelloWorldState,
      HelloWorldDomainEvent
    >
  ) {}

  async handleWork(work: (context: Context) => Promise<void>) {
    return this.store.withTranscation(async (transaction) => {
      let hydratedRoot: HelloWorldAggregateRoot | undefined;

      const onHydrated = (root: HelloWorldAggregateRoot) => {
        hydratedRoot = root;
      };

      const factory = new HelloWorldFactory(onHydrated);
      const repository = new HelloWorldRepository(
        this.store,
        factory,
        transaction
      );

      const context = {
        repository,
        factory,
      };

      await work(context);

      await context.repository.save(assertExistence(hydratedRoot));
    });
  }
}
