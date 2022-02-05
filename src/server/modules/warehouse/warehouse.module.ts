import { GetRoastedCoffeeQueryHandler } from './features/warehouse-roasted-coffee/get-roasted-coffee-history';
import { UseRoastedCoffeeLeftoversCommandHandler } from './features/warehouse-roasted-coffee/use-roasted-coffee-leftovers';
import { AdjustRoastedCoffeeLeftoversCommandHandler } from './features/warehouse-roasted-coffee/adjust-roasted-coffee-leftovers';
import { AddRoastedCoffeeLeftoversCommandHandler } from './features/warehouse-roasted-coffee/add-roasted-coffee-leftovers';
import { Module, DynamicModule } from '@nestjs/common';

import { WarehouseContext } from './context/warehouse-roasted-coffee-context';
import { WarehouseRoastedCoffeeFeature } from './features/warehouse-roasted-coffee-features';
import { WarehouseRoastedCoffeeProjection } from './features/warehouse-roasted-coffee/warehouse-roasted-coffee-projection';
import { GetRoastedCoffeeProjectionQueryHandler } from './features/warehouse-roasted-coffee/get-roasted-coffee-projection';

const WarehouseRoastedCoffeeCommandHandlers = [
  AddRoastedCoffeeLeftoversCommandHandler,
  AdjustRoastedCoffeeLeftoversCommandHandler,
  UseRoastedCoffeeLeftoversCommandHandler,
];

const WarehouseRoastedCoffeeQueryHandlers = [
  GetRoastedCoffeeQueryHandler,
  GetRoastedCoffeeProjectionQueryHandler,
];

@Module({})
export class WarehouseModule {
  static configure = (ContextModule: DynamicModule): DynamicModule => {
    return {
      module: WarehouseModule,
      imports: [ContextModule],
      providers: [
        WarehouseContext,

        ...WarehouseRoastedCoffeeCommandHandlers,
        ...WarehouseRoastedCoffeeQueryHandlers,
        WarehouseRoastedCoffeeProjection,
        WarehouseRoastedCoffeeFeature,
      ],
      exports: [],
    };
  };
}
