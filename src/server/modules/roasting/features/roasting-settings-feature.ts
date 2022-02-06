import { AssignProductVariationCommand } from './roasting-settings-feature/assign-product-variation';
import { Injectable } from '@nestjs/common';

import { CommandProps } from './../../cqrs/decorators/command-handler.decorator';
import { CommandBus } from '../../cqrs/buses/command-bus';
import { QueryBus } from '../../cqrs/buses/query-bus';
import { AddGreenCoffeeCommand } from './roasting-settings-feature/add-green-coffee';
import { QueryProps } from './../../cqrs/decorators/query-handler.decorator';
import { GetRoastingSettingsQuery } from './roasting-settings-feature/get-roasting-settings';
import {
  RoastingGreenCoffee,
  RoastingRoastedCoffee,
  RoastingProductVariation,
} from '../domain/settings/roasting-settings-types';
import { UpdateGreenCoffeeCommand } from './roasting-settings-feature/update-green-coffee';
import { AddRoastedCoffeeCommand } from './roasting-settings-feature/add-roasted-coffee';
import { UpdateRoastedCoffeeCommand } from './roasting-settings-feature/update-roasted-coffee';

export interface AddGreenCoffeeProps extends CommandProps {
  uuid: string;
  name: string;
  batchWeight: number;
  roastingLossFactor: number;
}

export interface UpdateGreenCoffeeProps extends CommandProps {
  uuid: string;
  name: string;
  batchWeight: number;
  roastingLossFactor: number;
}

export interface AddRoastedCoffeeProps extends CommandProps {
  uuid: string;
  name: string;
  greenCoffeeUuid: string;
}

export interface UpdateRoastedCoffeeProps extends CommandProps {
  uuid: string;
  name: string;
  greenCoffeeUuid: string;
}

export interface AssignProductVariationProps extends CommandProps {
  id: number;
  weight: number;
  roastedCoffeeUuid: string;
}

export type GetRoastingSettingsProps = QueryProps;

export type GetRoastingSettingsResult = {
  greenCoffees: RoastingGreenCoffee[];
  roastedCoffees: RoastingRoastedCoffee[];
  productVariations: RoastingProductVariation[];
};

@Injectable()
export class RoastingSettingsFeature {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  addGreenCoffee(props: AddGreenCoffeeProps): Promise<void> {
    return this.commandBus.execute(new AddGreenCoffeeCommand(props));
  }

  updateGreenCoffee(props: UpdateGreenCoffeeProps): Promise<void> {
    return this.commandBus.execute(new UpdateGreenCoffeeCommand(props));
  }

  addRoastedCoffee(props: AddRoastedCoffeeProps): Promise<void> {
    return this.commandBus.execute(new AddRoastedCoffeeCommand(props));
  }

  updateRoastedCoffee(props: UpdateRoastedCoffeeProps): Promise<void> {
    return this.commandBus.execute(new UpdateRoastedCoffeeCommand(props));
  }

  assignProductVariation(props: AssignProductVariationProps): Promise<void> {
    return this.commandBus.execute(new AssignProductVariationCommand(props));
  }

  getRoastingSettings(
    props: GetRoastingSettingsProps
  ): Promise<GetRoastingSettingsResult> {
    return this.queryBus.execute(new GetRoastingSettingsQuery(props));
  }
}
