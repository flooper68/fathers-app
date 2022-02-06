import { Subject } from 'rxjs';

import { AggregateRoot } from '../../../common/aggregate-root';
import { RoastingSettingsState } from '../settings/roasting-settings-types';
import { addOrderAction } from './actions/add-order';
import {
  RoastingDomainEvent,
  RoastingDomainReducer,
  RoastingDomainEventCreators,
} from './roasting-events';
import { checkRoastingInvariants } from './roasting-invariants';
import { RoastingMapping } from './roasting-mapping';
import {
  RoastingNormalizedState,
  RoastingState,
  RoastingContextExtension,
  RoastingStatus,
} from './roasting-types';

export class RoastingRoot extends AggregateRoot<
  RoastingNormalizedState,
  RoastingState,
  RoastingDomainEvent,
  void
> {
  private constructor(
    props: RoastingState,
    context: {
      contextExtension: RoastingContextExtension;
      subject: Subject<RoastingDomainEvent>;
    }
  ) {
    super(props, {
      checkInvariants: checkRoastingInvariants,
      denormalizeState: RoastingMapping.denormalizeState,
      normalizeState: RoastingMapping.normalizeState,
      reducer: RoastingDomainReducer,
      subject: context.subject,
      contextExtension: context.contextExtension,
    });
  }

  static create = (
    props: {
      uuid: string;
      roastingDate: string;
      status: RoastingStatus;
      settings: RoastingSettingsState;
    },
    context: {
      contextExtension: RoastingContextExtension;
      subject: Subject<RoastingDomainEvent>;
    }
  ): RoastingRoot => {
    const entity = new RoastingRoot(
      {
        uuid: props.uuid,
        roastingDate: props.roastingDate,
        status: RoastingStatus.IN_PLANNING,
        settings: props.settings,
        finishedBatches: [],
        realYield: [],
        lineItems: [],
        orders: [],
      },
      context
    );
    entity.dispatch(RoastingDomainEventCreators.RoastingCreated(props));
    return entity;
  };

  static hydrate = (
    props: RoastingState,
    context: {
      contextExtension: RoastingContextExtension;
      subject: Subject<RoastingDomainEvent>;
    }
  ): RoastingRoot => {
    return new RoastingRoot(props, context);
  };

  addOrder = this.useDomainAction(addOrderAction);
}
