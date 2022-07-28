// Definig shape of types

type OrderItem = {
  productId: number;
  amount: number;
};

enum OrderStatus {
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

type OrderState = NewOrderState | PreparedOrderState | ShippedOrderState;

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

type OrderDomainEvents =
  | OrderCreated
  | OrderPrepared
  | OrderShipped
  | OrderNoteChanged;

// Implementation

export class NewOrder {
  private _state: any;

  private constructor(
    props: NewOrderState,
    private readonly context: {
      dispatchEvent: (event: any) => void;
    }
  ) {
    this._state = props;
  }

  private dispatch(event: OrderCreated | OrderPrepared) {
    switch (event.type) {
      case 'OrderCreated': {
        break;
      }
      case 'OrderPrepared': {
        this._state.status = OrderStatus.Prepared;
        this._state.note = event.payload.note;
        break;
      }
    }
    this.context.dispatchEvent(event);
  }

  static create(
    props: { id: number; createdAt: string; items: OrderItem[] },
    dispatchEvent: (event: any) => void
  ) {
    const order = new NewOrder(
      {
        id: props.id,
        createdAt: props.createdAt,
        items: props.items,
        status: OrderStatus.Placed,
      },
      {
        dispatchEvent,
      }
    );

    order.dispatch(new OrderCreated(props));

    return order;
  }

  getState(): Readonly<NewOrderState> {
    return this._state;
  }

  prepareOrder(note?: string) {
    this.dispatch(new OrderPrepared({ id: this._state.id, note }));
    return new FinishedOrder(this._state as PreparedOrderState, this.context);
  }
}

export class FinishedOrder {
  private _state: any;

  constructor(
    props: OrderState,
    private readonly context: {
      dispatchEvent: (event: any) => void;
    }
  ) {
    this._state = props;
  }

  private dispatch(event: OrderDomainEvents) {
    switch (event.type) {
      case 'OrderCreated': {
        break;
      }
      case 'OrderPrepared': {
        this._state.status = OrderStatus.Prepared;
        this._state.note = event.payload.note;
        break;
      }
      case 'OrderNoteChanged': {
        this._state.note = event.payload.note;
        break;
      }
    }
    this.context.dispatchEvent(event);
  }

  changeNote(note: string) {
    this.dispatch(new OrderNoteChanged({ id: this._state.id, note }));
    return new FinishedOrder(this._state as PreparedOrderState, this.context);
  }

  shipOrder(shippedDate: string) {
    this.dispatch(new OrderShipped({ id: this._state.id, shippedDate }));
    return new ShippedOrder(this._state as ShippedOrderState);
  }

  getState(): Readonly<PreparedOrderState> {
    return this._state;
  }
}

export class ShippedOrder {
  private _state: ShippedOrderState;

  constructor(props: ShippedOrderState) {
    this._state = props;
  }

  getState(): Readonly<ShippedOrderState> {
    return this._state;
  }
}

export type Order = NewOrder | FinishedOrder | ShippedOrder;
