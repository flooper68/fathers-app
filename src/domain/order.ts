// Definig shape of types

import { DomainContext } from './domain-types';

export type OrderItem = {
  productId: number;
  amount: number;
};

export enum OrderStatus {
  Placed = 'Placed',
  Prepared = 'Prepared',
  Shipped = 'Shipped',
}

type NewOrderState = {
  id: number;
  createdAt: string;
  items: OrderItem[];
  status: OrderStatus.Placed;
};

type PreparedOrderState = {
  id: number;
  createdAt: string;
  items: OrderItem[];
  status: OrderStatus.Prepared;
  note?: string;
};

type ShippedOrderState = {
  id: number;
  createdAt: string;
  items: OrderItem[];
  status: OrderStatus.Shipped;
  shippedDate: string;
  note?: string;
};

export type OrderState = NewOrderState | PreparedOrderState | ShippedOrderState;

// Defining events that happen and what they hold

export class OrderCreated {
  readonly type = 'OrderCreated';
  constructor(
    public readonly payload: {
      id: number;
      createdAt: string;
      items: OrderItem[];
    }
  ) {}
}

export class OrderPrepared {
  readonly type = 'OrderPrepared';
  constructor(
    public readonly payload: {
      id: number;
      note?: string;
    }
  ) {}
}

export class OrderNoteChanged {
  readonly type = 'OrderNoteChanged';
  constructor(
    public readonly payload: {
      id: number;
      note: string;
    }
  ) {}
}

export class OrderShipped {
  readonly type = 'OrderShipped';
  constructor(
    public readonly payload: {
      id: number;
      shippedDate: string;
    }
  ) {}
}

export type OrderDomainEvents =
  | OrderCreated
  | OrderPrepared
  | OrderShipped
  | OrderNoteChanged;

// Implementation

export class NewOrder {
  private constructor(
    public readonly state: NewOrderState,
    private readonly context: DomainContext
  ) {}

  static create = (
    props: { id: number; createdAt: string; items: OrderItem[] },
    context: DomainContext
  ) => {
    const state = { ...props, status: OrderStatus.Placed } as const;

    context.dispatch(new OrderCreated(state));

    return new NewOrder(state, context);
  };

  static hydrate = (state: NewOrderState, context: DomainContext) => {
    return new NewOrder(state, context);
  };

  prepareOrder(note?: string) {
    return PreparedOrder.create(
      {
        ...this.state,
        status: OrderStatus.Prepared,
        note: note,
      },
      this.context
    );
  }

  isNewOrder = (): this is NewOrder => true;
  isPreparedOrder = (): this is never => false;
  isShippedOrder = (): this is never => false;
}

export class PreparedOrder {
  private constructor(
    public readonly state: PreparedOrderState,
    private readonly context: DomainContext
  ) {}

  static create = (state: PreparedOrderState, context: DomainContext) => {
    context.dispatch(new OrderPrepared({ id: state.id, note: state.note }));

    return new PreparedOrder(state, context);
  };

  static hydrate = (state: PreparedOrderState, context: DomainContext) => {
    return new PreparedOrder(state, context);
  };

  changeNote(note: string) {
    this.context.dispatch(new OrderNoteChanged({ id: this.state.id, note }));
    return new PreparedOrder({ ...this.state, note }, this.context);
  }

  shipOrder(shippedDate: string) {
    return ShippedOrder.create(
      { ...this.state, shippedDate, status: OrderStatus.Shipped },
      this.context
    );
  }

  isNewOrder = (): this is never => false;
  isPreparedOrder = (): this is PreparedOrder => true;
  isShippedOrder = (): this is never => false;
}

export class ShippedOrder {
  private constructor(public readonly state: ShippedOrderState) {}

  static create = (state: ShippedOrderState, context: DomainContext) => {
    context.dispatch(
      new OrderShipped({
        id: state.id,
        shippedDate: state.shippedDate,
      })
    );

    return new ShippedOrder(state);
  };

  static hydrate = (state: ShippedOrderState) => {
    return new ShippedOrder(state);
  };

  isNewOrder = (): this is never => false;
  isPreparedOrder = (): this is never => false;
  isShippedOrder = (): this is ShippedOrder => true;
}

export type Order = NewOrder | PreparedOrder | ShippedOrder;
