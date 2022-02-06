import { Subject } from 'rxjs';

import { AggregateRoot } from '../../../common/aggregate-root';
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
    },
    context: {
      contextExtension: RoastingContextExtension;
      subject: Subject<RoastingDomainEvent>;
    }
  ): RoastingRoot => {
    const entity = new RoastingRoot(
      {
        uuid: props.uuid,
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
}
