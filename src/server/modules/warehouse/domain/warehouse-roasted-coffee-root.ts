import { Subject } from 'rxjs';

import {
  WarehouseRoastedCoffeeDomainEvent,
  WarehouseRoastedCoffeeDomainEventCreators,
  WarehouseRoastedCoffeeDomainReducer,
} from './warehouse-roasted-coffee-events';
import { AggregateRoot } from '../../common/aggregate-root';
import {
  WarehouseRoastedCoffeeContextExtension,
  WarehouseRoastedCoffeeState,
} from './warehouse-roasted-coffee-types';
import { checkWarehouseRoastedCoffeeInvariants } from './warehouse-roasted-coffee-invariants';
import { addLeftoversAction } from './actions/add-leftovers';
import { adjustLeftoversAction } from './actions/adjust-leftovers';
import { useLeftoversAction } from './actions/use-leftovers';

export class WarehouseRoastedCoffeeRoot extends AggregateRoot<
  WarehouseRoastedCoffeeState,
  WarehouseRoastedCoffeeState,
  WarehouseRoastedCoffeeDomainEvent,
  void
> {
  private constructor(
    props: WarehouseRoastedCoffeeState,
    context: {
      contextExtension: WarehouseRoastedCoffeeContextExtension;
      subject: Subject<WarehouseRoastedCoffeeDomainEvent>;
    }
  ) {
    super(props, {
      checkInvariants: checkWarehouseRoastedCoffeeInvariants,
      denormalizeState: (state) => state,
      normalizeState: (state) => state,
      reducer: WarehouseRoastedCoffeeDomainReducer,
      subject: context.subject,
      contextExtension: context.contextExtension,
    });
  }

  static create = (
    props: {
      uuid: string;
    },
    context: {
      contextExtension: WarehouseRoastedCoffeeContextExtension;
      subject: Subject<WarehouseRoastedCoffeeDomainEvent>;
    }
  ): WarehouseRoastedCoffeeRoot => {
    const entity = new WarehouseRoastedCoffeeRoot(
      {
        uuid: props.uuid,
        quantityOnHand: 0,
      },
      context
    );
    entity.dispatch(
      WarehouseRoastedCoffeeDomainEventCreators.WarehouseRoastedCoffeeCreated(
        props
      )
    );
    return entity;
  };

  static hydrate = (
    props: WarehouseRoastedCoffeeState,
    context: {
      contextExtension: WarehouseRoastedCoffeeContextExtension;
      subject: Subject<WarehouseRoastedCoffeeDomainEvent>;
    }
  ): WarehouseRoastedCoffeeRoot => {
    return new WarehouseRoastedCoffeeRoot(props, context);
  };

  addLeftovers = this.useDomainAction(addLeftoversAction);
  useLeftovers = this.useDomainAction(useLeftoversAction);
  adjustLeftovers = this.useDomainAction(adjustLeftoversAction);
}
