import 'reflect-metadata';
import { Observable } from 'rxjs';

import { IEvent } from './events-handler.decorator';

export const SAGA_METADATA = '__saga__';

export type ISaga<EventBase extends IEvent = IEvent> = (
  events$: Observable<EventBase>
) => Observable<void>;

export const Saga = (): PropertyDecorator => {
  // TODO improve typing as in other decorators
  return (target, propertyKey: string | symbol) => {
    const properties =
      Reflect.getMetadata(SAGA_METADATA, target.constructor) || [];
    Reflect.defineMetadata(
      SAGA_METADATA,
      [...properties, propertyKey],
      target.constructor
    );
  };
};

//TODO Add wrapper for metadata handling + metadata typing
