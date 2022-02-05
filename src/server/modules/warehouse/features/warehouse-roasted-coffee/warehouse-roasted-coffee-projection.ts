import { Injectable } from '@nestjs/common';

import { Consumer } from '../../../common/consumer';
import { MessageBroker } from '../../../common/message-broker';
import { WarehouseRoastedCoffeeDomainEvent } from '../../domain/warehouse-roasted-coffee-events';

interface ReducedState {
  amount: number;
}

const config = {
  name: 'test-consumer',
  stream: `application-stream`,
  initialState: {
    amount: 0,
  },
  // TODO add types, use reduxjs toolkit
  reducer: (state, event) => {
    switch (event.type) {
      case 'WarehouseRoastedCoffeeRoot/RoastingLeftoversAdded': {
        return {
          ...state,
          amount: state.amount + event.payload.amount,
        };
      }
      default: {
        return state;
      }
    }
  },
};

@Injectable()
export class WarehouseRoastedCoffeeProjection {
  private readonly _consumer: Consumer<
    ReducedState,
    WarehouseRoastedCoffeeDomainEvent
  >;
  constructor(private readonly messageBroker: MessageBroker) {
    this._consumer = new Consumer(this.messageBroker, config);

    setTimeout(() => {
      this._consumer.listen();
    }, 3000);
  }

  get model() {
    return this._consumer.model;
  }
}
