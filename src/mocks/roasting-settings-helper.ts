import { Subject } from 'rxjs';
import { DeepPartial } from 'redux';

import { RoastingSettingsRoot } from './../server/modules/roasting/domain/settings/roasting-settings-root';
import { RoastingSettingsDomainEvent } from './../server/modules/roasting/domain/settings/roasting-settings-events';
import { RoastingSettingsState } from './../server/modules/roasting/domain/settings/roasting-settings-types';
import { getRoastingSettingsFixture } from '../fixtures/roasting-settings';

export const buildRoastingSettingsTestHelper = (
  props: DeepPartial<RoastingSettingsState> = {}
) => {
  const subject = new Subject<RoastingSettingsDomainEvent>();

  const entity = RoastingSettingsRoot.hydrate(
    getRoastingSettingsFixture(props),
    { subject, contextExtension: undefined }
  );

  const events: RoastingSettingsDomainEvent[] = [];

  subject.subscribe((item) => events.push(item));

  const getEvents = () => {
    subject.complete();
    return events;
  };

  return { entity, getEvents };
};
