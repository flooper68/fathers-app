import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

import { EventOutbox } from '../../common/event-outbox';
import { AggregateRootStore } from '../../common/aggreagte-root-store';
import { roastingSettingsModel } from './roasting-settings-model';
import { assertExistence } from '../../common/assert-existence';
import { RoastingFactory } from './roasting-factory';
import { RoastingRepository } from './roasting-repository';
import { RoastingDomainEvent } from '../domain/roasting/roasting-events';
import { RoastingRoot } from '../domain/roasting/roasting-root';
import { roastingModel } from './roasting-model';

interface Context {
  repository: RoastingRepository;
  factory: RoastingFactory;
}

@Injectable()
export class RoastingContext {
  constructor(
    //TODO fix any
    private readonly store: AggregateRootStore<any, any>,
    private readonly outbox: EventOutbox<never>
  ) {
    outbox.registerOutbox(roastingSettingsModel);
  }

  async handleWork(
    work: (context: Context) => Promise<void>,
    correlationUuid: string
  ) {
    return this.store.withTranscation(async (transaction) => {
      let hydratedRoot: RoastingRoot | undefined;
      const subject = new Subject<RoastingDomainEvent>();
      const events: RoastingDomainEvent[] = [];
      subject.subscribe((event) => events.push(event));

      const onHydrated = (root: RoastingRoot) => {
        hydratedRoot = root;
      };

      const factory = new RoastingFactory(subject, onHydrated);
      const repository = new RoastingRepository(
        this.store,
        factory,
        transaction,
        roastingModel,
        roastingSettingsModel
      );

      const context = {
        repository,
        factory,
      };

      await work(context);
      subject.complete();

      await context.repository.save(
        assertExistence(hydratedRoot?.getState()),
        events.map((event) => ({
          ...event,
          uuid: v4(),
          correlationUuid,
          rootUuid: hydratedRoot?.getState().uuid,
        }))
      );
      this.outbox.checkout();
    });
  }
}
