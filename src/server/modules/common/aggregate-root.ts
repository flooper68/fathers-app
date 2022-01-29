import { Subject } from 'rxjs';
import {
  AnyAction,
  CombinedState,
  configureStore,
  PreloadedState,
  Reducer,
  Store,
} from '@reduxjs/toolkit';
import { NoInfer } from '@reduxjs/toolkit/dist/tsHelpers';

export type DomainAction<P, C> = (props: P, context: C) => void;
export type DomainActionContext<S, CE = unknown> = {
  dispatch: (event: AnyAction) => void;
  getState: () => S;
} & CE;

export abstract class AggregateRoot<
  R extends { uuid: string },
  S extends { uuid: string },
  E extends AnyAction,
  C
> {
  protected readonly _store: Store<R>;
  protected readonly _actionContext: DomainActionContext<S, C>;
  protected readonly _checkInvariants: (state: S) => void;
  protected readonly _mapState: (state: R) => S;
  protected readonly _subject: Subject<E>;

  protected dispatch = (event: AnyAction): void => {
    this._store.dispatch(event);
    this._subject.next(event as E);
  };

  protected useDomainAction = <P>(
    action: (props: P, context: typeof this._actionContext) => void
  ) => (props: P): void => {
    action(props, this._actionContext);
    this._checkInvariants(this.getState());
  };

  constructor(
    props: S,
    context: {
      reducer: Reducer<R>;
      normalizeState: (state: S) => R;
      denormalizeState: (state: R) => S;
      checkInvariants: (state: S) => void;
      contextExtension: C;
      subject: Subject<E>;
    }
  ) {
    this._store = configureStore({
      reducer: context.reducer,
      preloadedState: context.normalizeState(props) as PreloadedState<
        CombinedState<NoInfer<R>>
      >,
    });
    this._actionContext = {
      ...context.contextExtension,
      store: this._store,
      dispatch: this.dispatch,
      getState: this.getState,
    };
    this._checkInvariants = context.checkInvariants;
    this._subject = context.subject;
    this._mapState = context.denormalizeState;

    this._checkInvariants(this.getState());
  }

  getState = (): S => {
    return this._mapState(this._store.getState());
  };

  get uuid(): string {
    return this._store.getState().uuid;
  }
}
