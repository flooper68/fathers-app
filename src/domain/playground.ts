import { Event } from './domain-types';
import { NewOrder, Order, OrderStatus, ShippedOrder } from './order';

const context = {
  dispatch: (event: Event<string, unknown>) => {
    console.log(event);
  },
};

const getOrder = (): Order => {
  return ShippedOrder.hydrate({
    id: 0,
    createdAt: 'today',
    items: [],
    status: OrderStatus.Shipped,
    shippedDate: 'today',
    note: 'it was nice',
  });
};

const newOrder = NewOrder.create(
  { id: 1, createdAt: 'today', items: [] },
  context
);

const preparedOrder = newOrder.prepareOrder();

const preparedWithChangedNote = preparedOrder.changeNote('Note');

const shippedOrder = preparedWithChangedNote.shipOrder('today');

console.log(shippedOrder.state);

const unknownOrder = getOrder();

if (unknownOrder.isShippedOrder()) {
  console.log(`Order is finished`, unknownOrder.state);
}

if (unknownOrder.isNewOrder()) {
  console.log(`Order is new`);
}

if (unknownOrder.isPreparedOrder()) {
  console.log(`Order is prepared`);
}
