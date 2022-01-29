import { Injectable, Type } from '@nestjs/common';
import { Observable } from 'rxjs';

import { IEventsHandler, IEvent } from '../decorators/events-handler.decorator';
import { ISaga } from '../decorators/saga.decorator';

export type EventHandlerType = Type<IEventsHandler<IEvent>>;

@Injectable()
export abstract class EventBus {
  // This can maybe be ditched and used generic pubslish of Special Outbox Event
  abstract checkout(): void;

  // This can maybe be ditched and used generic subscribe of Special Outbox Event
  abstract subscribeCheckout(callback: () => void): void;

  abstract publish(event: IEvent): void;

  abstract publishAll(events: IEvent[]): void;

  abstract registerSagas(types: Type<unknown>[] | undefined): void;

  abstract registerHandlers(handlers: EventHandlerType[] | undefined): void;

  abstract getStream(): Observable<IEvent>;
}
