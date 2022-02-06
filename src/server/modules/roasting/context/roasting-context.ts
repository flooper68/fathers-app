import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

import { RoastingSettingsDomainEvent } from './../domain/settings/roasting-settings-events';
import { EventOutbox } from './../../common/event-outbox';
import { RoastingSettingsRepository } from './roasting-settings-repository';
import { RoastingFactory } from './roasting-factory';
import { AggregateRootStore } from '../../common/aggreagte-root-store';
import { roastingSettingsModel } from './roasting-settings-model';
import { RoastingSettingsRoot } from '../domain/settings/roasting-settings-root';
import { assertExistence } from '../../common/assert-existence';

interface Context {
  repository: RoastingSettingsRepository;
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
      let hydratedRoot: RoastingSettingsRoot | undefined;
      const subject = new Subject<RoastingSettingsDomainEvent>();
      const events: RoastingSettingsDomainEvent[] = [];
      subject.subscribe((event) => events.push(event));

      const onHydrated = (root: RoastingSettingsRoot) => {
        hydratedRoot = root;
      };

      const factory = new RoastingFactory(subject, onHydrated);
      const repository = new RoastingSettingsRepository(
        this.store,
        factory,
        transaction,
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
