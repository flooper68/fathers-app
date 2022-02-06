import { Injectable } from '@nestjs/common';

import { GetRoastedCoffeeQuery } from './warehouse-roasted-coffee/get-roasted-coffee-history';
import { AdjustRoastedCoffeeLeftoversCommand } from './warehouse-roasted-coffee/adjust-roasted-coffee-leftovers';
import { UseRoastedCoffeeLeftoversCommand } from './warehouse-roasted-coffee/use-roasted-coffee-leftovers';
import { AddRoastedCoffeeLeftoversCommand } from './warehouse-roasted-coffee/add-roasted-coffee-leftovers';
import { CommandBus } from '../../cqrs/buses/command-bus';
import { QueryBus } from '../../cqrs/buses/query-bus';
import { CommandProps } from '../../cqrs/decorators/command-handler.decorator';
import { QueryProps } from '../../cqrs/decorators/query-handler.decorator';
import { WarehouseRoastedCoffeeDomainEvent } from '../domain/warehouse-roasted-coffee-events';
import { GetWarehouseRoastedCoffeeQuery } from './warehouse-roasted-coffee/get-warehouse-roasted-coffee';
import { GetWarehouseRoastedCoffeeByIdsQuery } from './warehouse-roasted-coffee/get-warehouse-roasted-coffee-by-ids';
import { GetWarehouseRoastedCoffeesQuery } from './warehouse-roasted-coffee/get-warehouse-roasted-coffees';

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

export interface GetRoastedCoffeeHistoryResult {
  events: WarehouseRoastedCoffeeDomainEvent[];
}

export interface GetWarehouseRoastedCoffeeProps extends QueryProps {
  id: string;
}

export interface GetWarehouseRoastedCoffeeResult {
  roastedCoffeeId: string;
  quantityOnHand: number;
  lastUpdated?: string;
  lastUpdateReason?: string;
}

export type GetWarehouseRoastedCoffeesProps = QueryProps;

export type GetWarehouseRoastedCoffeesResult = {
  roastedCoffeeId: string;
  quantityOnHand: number;
  lastUpdated?: string;
  lastUpdateReason?: string;
}[];

export interface GetWarehouseRoastedCoffeeByIdsProps extends QueryProps {
  ids: number[];
}

export interface GetWarehouseRoastedCoffeeByIdsResult {
  coffees: {
    roastedCoffeeId: string;
    quantityOnHand: number;
    lastUpdated?: string;
    lastUpdateReason?: string;
  }[];
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

  getRoastedCoffeeHistory = (
    props: GetRoastedCoffeeHistoryProps
  ): Promise<GetRoastedCoffeeHistoryResult> => {
    return this.queryBus.execute(new GetRoastedCoffeeQuery(props));
  };

  getWarehouseRoastedCoffee = (
    props: GetWarehouseRoastedCoffeeProps
  ): Promise<GetWarehouseRoastedCoffeeResult | undefined> => {
    return this.queryBus.execute(new GetWarehouseRoastedCoffeeQuery(props));
  };

  getWarehouseRoastedCoffees = (
    props: GetWarehouseRoastedCoffeesProps
  ): Promise<GetWarehouseRoastedCoffeesResult> => {
    return this.queryBus.execute(new GetWarehouseRoastedCoffeesQuery(props));
  };

  getWarehouseRoastedCoffeeByIds = (
    props: GetWarehouseRoastedCoffeeByIdsProps
  ): Promise<GetWarehouseRoastedCoffeeByIdsResult> => {
    return this.queryBus.execute(
      new GetWarehouseRoastedCoffeeByIdsQuery(props)
    );
  };
}
