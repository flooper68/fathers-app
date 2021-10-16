import {
  BusinessError,
  ReducerMap,
  ReducerState,
  StateReducer,
} from '../../common';
import {
  RoastingLeftoversAdded,
  RoastingLeftOversAddedType,
} from '../events/roasting-leftover-added';
import {
  RoastingLeftoversAdjusted,
  RoastingLeftOversAdjustedType,
} from '../events/roasting-leftover-adjusted';
import {
  RoastingLeftoversUsed,
  RoastingLeftOversUsedType,
} from '../events/roasting-leftover-used';
import { WarehouseRoastingEvent } from '../warehouse-contracts';

interface CurrentState extends ReducerState {
  quantityOnHand: number;
  version: number;
}

export class WarehouseRoastedCoffeeEntity {
  readonly id: string;
  readonly events: WarehouseRoastingEvent[] = [];
  readonly uncommittedEvents: WarehouseRoastingEvent[] = [];

  private _state: StateReducer<CurrentState, WarehouseRoastingEvent>;
  private _reducerMap: ReducerMap<CurrentState, WarehouseRoastingEvent> = {
    [RoastingLeftOversUsedType]: (state, event) => {
      const payload = (<RoastingLeftoversUsed>event).payload;
      return {
        ...state,
        quantityOnHand: state.quantityOnHand - payload.amount,
      };
    },
    [RoastingLeftOversAddedType]: (state, event) => {
      const payload = (<RoastingLeftoversAdded>event).payload;
      return {
        ...state,
        quantityOnHand: state.quantityOnHand + payload.amount,
      };
    },
    [RoastingLeftOversAdjustedType]: (state, event) => {
      const payload = (<RoastingLeftoversAdjusted>event).payload;
      return {
        ...state,
        quantityOnHand: payload.newAmount,
      };
    },
  };

  private constructor(props: {
    id: string;
    currentState?: CurrentState;
    events: WarehouseRoastingEvent[];
  }) {
    this.id = props.id;
    this._state = new StateReducer({
      initialState: props.currentState ?? {
        quantityOnHand: 0,
        version: 0,
      },
      reducers: this._reducerMap,
    });
    this.events = props.events;
  }

  static create = (props: {
    id: string;
    currentState?: {
      quantityOnHand: number;
      version: number;
    };
    events: WarehouseRoastingEvent[];
  }) => {
    if (props.currentState && props.currentState?.quantityOnHand < 0) {
      throw new BusinessError(`Amount can not be lower than 0`);
    }

    return new WarehouseRoastedCoffeeEntity(props);
  };

  private addEvent = (event: WarehouseRoastingEvent) => {
    this._state.reduce(event);
    this.uncommittedEvents.push(event);
  };

  public getCurrentState = () => {
    return this._state.getState();
  };

  public addLeftOvers = (props: {
    amount: number;
    roastingId: string;
    timestamp: string;
  }): void => {
    this.addEvent(
      new RoastingLeftoversAdded({
        ...props,
        roastedCoffeeId: this.id,
      })
    );
  };

  public useLeftOvers = (props: {
    amount: number;
    timestamp: string;
  }): void => {
    if (this._state.getState().quantityOnHand - props.amount < 0) {
      throw new BusinessError(`Amount can not be lower than 0`);
    }

    this.addEvent(
      new RoastingLeftoversUsed({
        ...props,
        roastedCoffeeId: this.id,
      })
    );
  };

  public adjustLeftOvers = (props: {
    newAmount: number;
    timestamp: string;
  }): void => {
    if (props.newAmount < 0) {
      throw new BusinessError(`Amount can not be lower than 0`);
    }

    this.addEvent(
      new RoastingLeftoversAdjusted({
        ...props,
        roastedCoffeeId: this.id,
      })
    );
  };
}
