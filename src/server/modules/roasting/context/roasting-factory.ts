import { Subject } from 'rxjs';

import { RoastingRoot } from './../domain/roasting/roasting-root';
import { RoastingDomainEvent } from './../domain/roasting/roasting-events';
import { RoastingState } from '../domain/roasting/roasting-types';
import { getLineItemRoastingPlan } from '../domain/roasting/actions/internal/get-line-item-roasting-plan';
import { getRoastingPlan } from '../domain/roasting/actions/internal/get-roasting-plan';
import { RoastingSettingsState } from './../domain/settings/roasting-settings-types';

export class RoastingFactory {
  constructor(
    private readonly subject: Subject<RoastingDomainEvent>,
    private readonly onHydrated: (root: RoastingRoot) => void
  ) {}

  hydrate(state: RoastingState) {
    const root = RoastingRoot.hydrate(state, {
      subject: this.subject,
      contextExtension: {
        getLineItemRoastingPlan,
        getRoastingPlan,
      },
    });

    this.onHydrated(root);

    return root;
  }

  create(props: {
    uuid: string;
    roastingDate: string;
    settings: RoastingSettingsState;
  }) {
    const root = RoastingRoot.create(props, {
      subject: this.subject,
      contextExtension: {
        getLineItemRoastingPlan,
        getRoastingPlan,
      },
    });

    this.onHydrated(root);

    return root;
  }
}
