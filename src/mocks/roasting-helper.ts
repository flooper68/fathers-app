import { Subject } from 'rxjs';
import { DeepPartial } from 'redux';

import { RoastingState } from './../server/modules/roasting/domain/roasting/roasting-types';
import { RoastingDomainEvent } from './../server/modules/roasting/domain/roasting/roasting-events';
import { RoastingRoot } from './../server/modules/roasting/domain/roasting/roasting-root';
import { getRoastingFixture } from '../fixtures/roasting';

export const buildRoastingTestHelper = (
  props: DeepPartial<RoastingState> = {}
) => {
  const subject = new Subject<RoastingDomainEvent>();

  const entity = RoastingRoot.hydrate(getRoastingFixture(props), {
    subject,
    contextExtension: undefined,
  });

  const events: RoastingDomainEvent[] = [];

  subject.subscribe((item) => events.push(item));

  const getEvents = () => {
    subject.complete();
    return events;
  };

  return { entity, getEvents };
};
