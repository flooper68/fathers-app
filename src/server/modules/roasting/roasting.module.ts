import { Module, DynamicModule } from '@nestjs/common';

import { AssignProductVariationCommandHandler } from './features/roasting-settings-feature/assign-product-variation';
import { UpdateRoastedCoffeeCommandHandler } from './features/roasting-settings-feature/update-roasted-coffee';
import { AddRoastedCoffeeCommandHandler } from './features/roasting-settings-feature/add-roasted-coffee';
import { GetRoastingSettingsQueryHandler } from './features/roasting-settings-feature/get-roasting-settings';
import { AddGreenCoffeeCommandHandler } from './features/roasting-settings-feature/add-green-coffee';
import { RoastingContext } from './context/roasting-context';
import { RoastingSettingsFeature } from './features/roasting-settings-feature';
import { UpdateGreenCoffeeCommandHandler } from './features/roasting-settings-feature/update-green-coffee';
import { RoastingSettingsContext } from './context/roasting-settings-context';
import { CreateRoastingCommandHandler } from './features/roasting-feature/create-roasting';
import { RoastingFeature } from './features/roasting-feature';

const RoastingSettingsCommandHandlers = [
  AddGreenCoffeeCommandHandler,
  UpdateGreenCoffeeCommandHandler,
  AddRoastedCoffeeCommandHandler,
  UpdateRoastedCoffeeCommandHandler,
  AssignProductVariationCommandHandler,
];

const RoastingSettingsQueryHandlers = [GetRoastingSettingsQueryHandler];

const RoastingSettingsHandlers = [CreateRoastingCommandHandler];

@Module({})
export class RoastingModule {
  static configure = (ContextModule: DynamicModule): DynamicModule => {
    return {
      module: RoastingModule,
      imports: [ContextModule],
      providers: [
        RoastingSettingsContext,
        ...RoastingSettingsCommandHandlers,
        ...RoastingSettingsQueryHandlers,
        RoastingSettingsFeature,

        RoastingContext,
        ...RoastingSettingsHandlers,
        RoastingFeature,
      ],
      exports: [RoastingSettingsFeature, RoastingFeature],
    };
  };
}
