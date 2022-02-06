import { Subject } from 'rxjs';

import { updateGreenCoffeeAction } from './actions/update-green-coffee';
import { addGreenCoffeeAction } from './actions/add-green-coffee';
import { AggregateRoot } from '../../../common/aggregate-root';
import {
  RoastingSettingsDomainEvent,
  RoastingSettingsDomainReducer,
  RoastingSettingsDomainEventCreators,
} from './roasting-settings-events';
import { checkRoastingSettingsInvariants } from './roasting-settings-invariants';
import { RoastingSettingsMapping } from './roasting-settings-mapping';
import {
  RoastingSettingsState,
  RoastingSettingsContextExtension,
  RoastingSettingsNormalizedState,
} from './roasting-settings-types';
import { addRoastedCoffeeAction } from './actions/add-roasted-coffee';
import { updateRoastedCoffeeAction } from './actions/update-roasted-coffee';
import { assignProductVariationAction } from './actions/assign-product-variation';

export class RoastingSettingsRoot extends AggregateRoot<
  RoastingSettingsNormalizedState,
  RoastingSettingsState,
  RoastingSettingsDomainEvent,
  void
> {
  private constructor(
    props: RoastingSettingsState,
    context: {
      contextExtension: RoastingSettingsContextExtension;
      subject: Subject<RoastingSettingsDomainEvent>;
    }
  ) {
    super(props, {
      checkInvariants: checkRoastingSettingsInvariants,
      denormalizeState: RoastingSettingsMapping.denormalizeState,
      normalizeState: RoastingSettingsMapping.normalizeState,
      reducer: RoastingSettingsDomainReducer,
      subject: context.subject,
      contextExtension: context.contextExtension,
    });
  }

  static create = (
    props: {
      uuid: string;
    },
    context: {
      contextExtension: RoastingSettingsContextExtension;
      subject: Subject<RoastingSettingsDomainEvent>;
    }
  ): RoastingSettingsRoot => {
    const entity = new RoastingSettingsRoot(
      {
        uuid: props.uuid,
        greenCoffees: [],
        roastedCoffees: [],
        productVariations: [],
      },
      context
    );
    entity.dispatch(
      RoastingSettingsDomainEventCreators.RoastingSettingsCreated(props)
    );
    return entity;
  };

  static hydrate = (
    props: RoastingSettingsState,
    context: {
      contextExtension: RoastingSettingsContextExtension;
      subject: Subject<RoastingSettingsDomainEvent>;
    }
  ): RoastingSettingsRoot => {
    return new RoastingSettingsRoot(props, context);
  };

  addGreenCoffee = this.useDomainAction(addGreenCoffeeAction);
  updateGreenCoffee = this.useDomainAction(updateGreenCoffeeAction);
  addRoastedCoffee = this.useDomainAction(addRoastedCoffeeAction);
  updateRoastedCoffee = this.useDomainAction(updateRoastedCoffeeAction);
  assignProductVariation = this.useDomainAction(assignProductVariationAction);
}
