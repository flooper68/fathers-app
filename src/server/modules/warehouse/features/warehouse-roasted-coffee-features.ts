import { Injectable } from '@nestjs/common';

import { GetRoastedCoffeeQuery } from './warehouse-roasted-coffee/get-roasted-coffee-history';
import { AdjustRoastedCoffeeLeftoversCommand } from './warehouse-roasted-coffee/adjust-roasted-coffee-leftovers';
import { UseRoastedCoffeeLeftoversCommand } from './warehouse-roasted-coffee/use-roasted-coffee-leftovers';
import { AddRoastedCoffeeLeftoversCommand } from './warehouse-roasted-coffee/add-roasted-coffee-leftovers';
import { CommandBus } from '../../cqrs/buses/command-bus';
import { QueryBus } from '../../cqrs/buses/query-bus';
import { CommandProps } from '../../cqrs/decorators/command-handler.decorator';
import { QueryProps } from '../../cqrs/decorators/query-handler.decorator';
import { GetRoastedCoffeeProjectionQuery } from './warehouse-roasted-coffee/get-roasted-coffee-projection';

export interface AddRoastingLeftoversProps extends CommandProps {
  roastedCoffeeId: string;
  amount: number;
  roastingId: string;
  timestamp: string;
}

export interface UseRoastedCoffeeLeftoversProps extends CommandProps {
  roastedCoffeeId: string;
  amount: number;
  timestamp: string;
}

export interface AdjustRoastedCoffeeLeftoversProps extends CommandProps {
  roastedCoffeeId: string;
  newAmount: number;
  timestamp: string;
}

export interface GetRoastedCoffeeHistoryProps extends QueryProps {
  roastedCoffeeId: string;
}

export interface GetRoastedCoffeeProjectionProps extends QueryProps {
  roastedCoffeeId: string;
}

@Injectable()
export class WarehouseRoastedCoffeeFeature {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  addRoastedCoffeeLeftovers = (
    props: AddRoastingLeftoversProps
  ): Promise<void> => {
    return this.commandBus.execute(new AddRoastedCoffeeLeftoversCommand(props));
  };

  useRoastedCoffeeLeftovers = (
    props: UseRoastedCoffeeLeftoversProps
  ): Promise<void> => {
    return this.commandBus.execute(new UseRoastedCoffeeLeftoversCommand(props));
  };

  adjustRoastedCoffeeLeftovers = (
    props: AdjustRoastedCoffeeLeftoversProps
  ): Promise<void> => {
    return this.commandBus.execute(
      new AdjustRoastedCoffeeLeftoversCommand(props)
    );
  };

  // TODO add Result type
  getRoastedCoffeeHistory = (
    props: GetRoastedCoffeeHistoryProps
  ): Promise<any> => {
    return this.queryBus.execute(new GetRoastedCoffeeQuery(props));
  };

  // TODO add Result type
  getRoastedCoffeeProjectionHistory = (
    props: GetRoastedCoffeeProjectionProps
  ): Promise<any> => {
    return this.queryBus.execute(new GetRoastedCoffeeProjectionQuery(props));
  };
}
