import { v4 } from 'uuid';

export type HelloWorldState = { uuid: string; count: number };

class HelloWorldCreated {
  readonly type = `HelloWorldCreated` as const;
  constructor(public readonly payload: { uuid: string }) {}
}

class HelloWorldCountChanged {
  readonly type = `HelloWorldCountChanged` as const;
  constructor(public readonly payload: { uuid: string; date: number }) {}
}

export type HelloWorldDomainEvent = HelloWorldCreated | HelloWorldCountChanged;

export class HelloWorldAggregateRoot {
  private _state: HelloWorldState;
  private _events: HelloWorldDomainEvent[] = [];
  private _lastPosition: number;

  private constructor(props: HelloWorldState, lastPosition: number) {
    this._state = props;
    this._lastPosition = lastPosition;
  }

  private dispatch = (event: any) => {
    this._events.push({
      ...event,
      position: this._lastPosition + this._events.length,
      correlationUuid: v4(),
    });
  };

  getState() {
    return this._state;
  }

  getEvents() {
    return this._events;
  }

  static create(uuid: string) {
    const root = new this({ count: 0, uuid }, 0);
    root.dispatch(new HelloWorldCreated({ uuid }));
    return root;
  }

  static hydrate(props: HelloWorldState, lastPosition: number) {
    return new this(props, lastPosition);
  }

  changeCount() {
    this.dispatch(
      new HelloWorldCountChanged({ date: Date.now(), uuid: this._state.uuid })
    );
    this._state = { ...this._state, count: this._state.count + 1 };
  }
}
