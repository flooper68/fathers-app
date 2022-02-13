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

const RoastingSettingsCommandHandlers = [
  AddGreenCoffeeCommandHandler,
  UpdateGreenCoffeeCommandHandler,
  AddRoastedCoffeeCommandHandler,
  UpdateRoastedCoffeeCommandHandler,
  AssignProductVariationCommandHandler,
];

const RoastingSettingsQueryHandlers = [GetRoastingSettingsQueryHandler];

@Module({})
export class RoastingModule {
  static configure = (ContextModule: DynamicModule): DynamicModule => {
    return {
      module: RoastingModule,
      imports: [ContextModule],
      providers: [
        RoastingContext,
        RoastingSettingsContext,

        ...RoastingSettingsCommandHandlers,
        ...RoastingSettingsQueryHandlers,
        RoastingSettingsFeature,
      ],
      exports: [RoastingSettingsFeature],
    };
  };
}
