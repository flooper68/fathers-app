import { Subject } from 'rxjs';

import { RoastingSettingsState } from '../domain/settings/roasting-settings-types';
import { RoastingSettingsDomainEvent } from './../domain/settings/roasting-settings-events';
import { RoastingSettingsRoot } from './../domain/settings/roasting-settings-root';
import { DEFAULT_SETTINGS_UUID } from './roasting-settings-repository';

export class RoastingFactory {
  constructor(
    private readonly subject: Subject<RoastingSettingsDomainEvent>,
    private readonly onHydrated: (root: RoastingSettingsRoot) => void
  ) {}

  hydrate(state: RoastingSettingsState) {
    const root = RoastingSettingsRoot.hydrate(state, {
      subject: this.subject,
      contextExtension: undefined,
    });

    this.onHydrated(root);

    return root;
  }

  create() {
    const root = RoastingSettingsRoot.create(
      { uuid: DEFAULT_SETTINGS_UUID },
      {
        subject: this.subject,
        contextExtension: undefined,
      }
    );

    this.onHydrated(root);

    return root;
  }
}
