import { Injectable } from '@nestjs/common';

import { Consumer } from '../../../common/consumer';
import { MessageBroker } from '../../../common/message-broker';
import { WarehouseRoastedCoffeeDomainEvent } from '../../domain/warehouse-roasted-coffee-events';

interface ReducedState {
  roastedCoffeeId: string;
  quantityOnHand: number;
  lastUpdated?: string;
  lastUpdateReason?: string;
}

const initialState: ReducedState = {
  roastedCoffeeId: '',
  quantityOnHand: 0,
};

const config = {
  name: 'test-consumer',
  stream: `application-stream`,
  initialState,
  reducer: (
    state: ReducedState,
    event: WarehouseRoastedCoffeeDomainEvent
  ): ReducedState => {
    switch (event.type) {
      case 'WarehouseRoastedCoffeeRoot/RoastingLeftoversAdded': {
        return {
          ...state,
          quantityOnHand: state.quantityOnHand + event.payload.amount,
        };
      }
      case 'WarehouseRoastedCoffeeRoot/RoastingLeftoversAdjusted': {
        return {
          ...state,
          quantityOnHand: event.payload.newAmount,
        };
      }
      case 'WarehouseRoastedCoffeeRoot/RoastingLeftoversUsed': {
        return {
          ...state,
          quantityOnHand: state.quantityOnHand - event.payload.amount,
        };
      }
      case 'WarehouseRoastedCoffeeRoot/WarehouseRoastedCoffeeCreated': {
        return {
          roastedCoffeeId: event.payload.uuid,
          quantityOnHand: 0,
        };
      }
      default: {
        throw Error(`Unknown event`);
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

    // TODO change listening mechanism
    setTimeout(() => {
      this._consumer.listen();
    }, 3000);
  }

  get model() {
    return this._consumer.model;
  }
}
