import 'reflect-metadata';

export const EVENTS_HANDLER_METADATA = '__eventsHandler';

// TODO do we need any here??
export interface IEvent<Type extends string = any, Payload = unknown> {
  type: Type;
  payload: Payload;
  correlationUuid?: string;
}

export interface IEventsHandler<T extends IEvent> {
  handle(event: T): Promise<void> | void;
}

export const EventsHandler = (...events: string[]): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(EVENTS_HANDLER_METADATA, events, target);
  };
};

//TODO Add wrapper for metadata handling + metadata typing
