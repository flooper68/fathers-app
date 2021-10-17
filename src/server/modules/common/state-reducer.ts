import {
  DomainEvent,
  ReducerMap,
  BusinessError,
  Reducer,
  ReducerState,
} from './contracts';

export class StateReducer<
  State extends ReducerState,
  EventType extends DomainEvent<unknown>
> implements Reducer<EventType, State> {
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
