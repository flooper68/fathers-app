export class BusinessError extends Error {}

export interface DomainEvent {
  readonly type: string;
  readonly payload: unknown;
}

export interface ReducerState {
  version: number;
}

export type ReducerMap<State extends ReducerState, EventType> = Record<
  string,
  (state: State, event: EventType) => State
>;

export class StateReducer<
  State extends ReducerState,
  EventType extends DomainEvent
> {
  private _currentState: State;

  private readonly _reducers: ReducerMap<State, EventType>;

  constructor(props: {
    initialState: State;
    reducers: ReducerMap<State, EventType>;
  }) {
    this._currentState = { ...props.initialState };
    this._reducers = props.reducers;
  }

  public reduce = (event: EventType) => {
    const reducer = this._reducers[event.type];
    if (!reducer) {
      throw new BusinessError(
        `Unknown event type ${event.type} - no reducer exists`
      );
    }
    this._currentState = reducer(this._currentState, event);
    this._currentState.version++;
  };

  public getState = () => {
    return this._currentState;
  };
}
