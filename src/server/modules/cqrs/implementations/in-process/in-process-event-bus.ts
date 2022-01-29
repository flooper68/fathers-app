import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isFunction } from 'lodash';

import {
  EVENTS_HANDLER_METADATA,
  IEvent,
  IEventsHandler,
} from '../../decorators/events-handler.decorator';
import { ISaga, SAGA_METADATA } from '../../decorators/saga.decorator';
import {
  InvalidSagaException,
  InvalidEventsHandlerException,
} from '../../errors/cqrs-errors';
import { Logger } from '../../../../../shared/logger';
import { EventBus } from '../../buses/event-bus';

export type EventHandlerType = Type<IEventsHandler<IEvent>>;

@Injectable()
export class InProcessEventBus implements EventBus {
  protected _subject$ = new Subject<IEvent>();
  protected _eventCheckout$ = new Subject<undefined>();
  protected readonly subscriptions: Subscription[] = [];

  constructor(private readonly moduleRef: ModuleRef) {
    Logger.info(
      `Initializing InProcessEventBus, all events and sagas will be handled in the main process, there are no separate workers.`
    );
  }

  checkout(): void {
    this._eventCheckout$.next(undefined);
  }

  subscribeCheckout(callback: () => void): void {
    this._eventCheckout$.subscribe(callback);
  }

  publish(event: IEvent): void {
    Logger.debug(`Event ${event.type} published`);
    this._subject$.next(event);
  }

  publishAll(events: IEvent[]): void {
    events.map((event) => this.publish(event));
  }

  registerSagas(types: Type<unknown>[] = []): void {
    Logger.info('Registering sagas', types);
    const sagas = types
      .map((target) => {
        const metadata: string[] =
          Reflect.getMetadata(SAGA_METADATA, target) || [];

        const instance = this.moduleRef.get(target, { strict: false }) as {
          [key: string]: ISaga<IEvent>;
        };

        if (!instance) {
          throw new InvalidSagaException();
        }

        return metadata.map((key: string) => {
          const handler = instance[key];

          if (!handler) {
            throw new InvalidSagaException();
          }

          return {
            handler: handler.bind(instance),
            class: target.name,
            method: key,
          };
        });
      })
      .flat();

    sagas.forEach((saga) => this.registerSaga(saga));
  }

  registerHandlers(handlers: EventHandlerType[] = []): void {
    Logger.info(`Registering event handlers`, handlers);
    handlers.forEach((handler) => this.registerHandler(handler));
  }

  private registerHandler(handler: EventHandlerType): void {
    const instance = this.moduleRef.get(handler, { strict: false });

    if (!instance) {
      throw new InvalidEventsHandlerException();
    }
    const eventsMetadata = Reflect.getMetadata(
      EVENTS_HANDLER_METADATA,
      handler
    ) as string[];

    eventsMetadata.map((metadata) => {
      const stream$ = this._subject$.pipe(
        filter((event) => {
          return event.type === metadata;
        })
      );
      Logger.info(`Subscribing handler ${handler.name} to event ${metadata}`);
      const subscription = stream$.subscribe(async (event) => {
        const start = Date.now();
        Logger.debug(`Handling ${event.type} event`);
        await instance.handle(event);
        Logger.debug(
          `Handling of ${event.type} finished, it took ${Date.now() - start} ms`
        );
      });
      this.subscriptions.push(subscription);
    });
  }

  private registerSaga(saga: {
    handler: ISaga<IEvent>;
    class: string;
    method: string;
  }): void {
    if (!isFunction(saga.handler)) {
      throw new InvalidSagaException();
    }
    const stream$ = saga.handler(this._subject$);
    if (!(stream$ instanceof Observable)) {
      throw new InvalidSagaException();
    }

    Logger.info(`Subscribing saga ${saga.class}.${saga.method}`);
    const subscription = stream$.subscribe();

    this.subscriptions.push(subscription);
  }

  getStream = (): Observable<IEvent> => {
    return this._subject$.asObservable();
  };
}
