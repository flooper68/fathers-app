import { NewOrder } from './order';

const dispatchEvent = (event: any) => {
  console.log(event);
};

const newOrder = NewOrder.create(
  { id: 1, createdAt: 'today', items: [] },
  dispatchEvent
);

const preparedOrder = newOrder.prepareOrder();

const preparedWithChangedNote = preparedOrder.changeNote('Note');

const shippedOrder = preparedWithChangedNote.shipOrder('today');

console.log(shippedOrder.getState());
