export interface Message<Payload> {
  type: string;
  payload: Payload;
}

export interface OrderedMessage<Payload> extends Message<Payload> {
  position: number;
}

export interface DomainEvent<Payload> extends Message<Payload> {
  readonly type: string;
  readonly payload: Payload;
}

export class BusinessError extends Error {}
export class EntityDoesNotExist extends Error {}

export interface ReducerState {
  version: number;
}

export type ReducerMap<State extends ReducerState, EventType> = Record<
  string,
  (state: State, event: EventType) => State
>;

export interface Reducer<EventType, State> {
  reduce: (event: EventType) => void;
  getState: () => State;
}

export interface MessageBroker {
  publishMessage: <Payload>(
    stream: string,
    message: Message<Payload>
  ) => Promise<void>;
  //TODO add option to unsubscribe
  consumeMessage: <Payload>(
    stream: string,
    type: string,
    handler: (message: OrderedMessage<Payload>) => void
  ) => void;
  consumeAll: <Payload>(
    stream: string,
    handler: (message: OrderedMessage<Payload>) => void
  ) => void;
  getMessage: (
    stream: string,
    position: number
  ) => Promise<OrderedMessage<unknown> | undefined>;
  getMessagesFrom: (
    stream: string,
    position: number,
    amount: number
  ) => Promise<OrderedMessage<unknown>[]>;
}
