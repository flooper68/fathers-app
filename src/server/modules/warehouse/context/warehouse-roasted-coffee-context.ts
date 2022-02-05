import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

import { WarehouseRoastedCoffeeFactory } from './warehouse-roasted-coffee-factory';
import { WarehouseRoastedCoffeeDomainEvent } from './../domain/warehouse-roasted-coffee-events';
import { WarehouseRoastedCoffeeRepository } from './warehouse-roasted-coffee-repository';
import { AggregateRootStore } from '../../common/aggreagte-root-store';
import { WarehouseRoastedCoffeeRoot } from '../domain/warehouse-roasted-coffee-root';
import { WarehouseRoastedCoffeeState } from '../domain/warehouse-roasted-coffee-types';
import { EventOutbox } from './../../common/event-outbox';
import { warehouseRoastedCoffeeModel } from './warehouse-roasted-coffee-model';
import { assertExistence } from '../../common/assert-existence';

interface Context {
  repository: WarehouseRoastedCoffeeRepository;
  factory: WarehouseRoastedCoffeeFactory;
}

@Injectable()
export class WarehouseContext {
  constructor(
    private readonly store: AggregateRootStore<
      WarehouseRoastedCoffeeState,
      WarehouseRoastedCoffeeDomainEvent
    >,
    private readonly outbox: EventOutbox<WarehouseRoastedCoffeeState>
  ) {
    outbox.registerOutbox(warehouseRoastedCoffeeModel);
  }

  async handleWork(
    work: (context: Context) => Promise<void>,
    correlationUuid: string
  ) {
    return this.store.withTranscation(async (transaction) => {
      let hydratedRoot: WarehouseRoastedCoffeeRoot | undefined;
      const subject = new Subject<WarehouseRoastedCoffeeDomainEvent>();
      const events: WarehouseRoastedCoffeeDomainEvent[] = [];
      subject.subscribe((event) => events.push(event));

      const onHydrated = (root: WarehouseRoastedCoffeeRoot) => {
        hydratedRoot = root;
      };

      const factory = new WarehouseRoastedCoffeeFactory(subject, onHydrated);
      const repository = new WarehouseRoastedCoffeeRepository(
        this.store,
        factory,
        transaction,
        warehouseRoastedCoffeeModel
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
