import { v4 } from 'uuid';
import {
  Field,
  Int,
  ObjectType,
  Resolver,
  Query,
  Mutation,
  InputType,
  Float,
  Args,
} from '@nestjs/graphql';

import { WarehouseRoastedCoffeeFeature } from '../modules/warehouse/features/warehouse-roasted-coffee-features';

@ObjectType()
export class WarehouseRoastedCoffee {
  @Field()
  roastedCoffeeId: string;

  @Field(() => Int)
  quantityOnHand: number;

  @Field({ nullable: true })
  lastUpdated?: string;

  @Field({ nullable: true })
  lastUpdateReason?: string;
}

@ObjectType()
export class CommandResult {
  @Field()
  success: boolean;
}

@InputType()
export class AddRoastedCoffeeLeftOversInput {
  @Field()
  roastedCoffeeId: string;

  @Field(() => Float)
  amount: number;

  @Field()
  roastingId: string;

  @Field()
  timestamp: string;

  @Field()
  correlationUuid: string;
}

@InputType()
export class UseRoastedCoffeeLeftOversInput {
  @Field()
  roastedCoffeeId: string;

  @Field(() => Float)
  amount: number;

  @Field()
  timestamp: string;

  @Field()
  correlationUuid: string;
}

@InputType()
export class AdjustRoastedCoffeeLeftOversInput {
  @Field()
  roastedCoffeeId: string;

  @Field(() => Float)
  newAmount: number;

  @Field()
  timestamp: string;

  @Field()
  correlationUuid: string;
}

@Resolver(() => WarehouseRoastedCoffee)
export class WarehouseResolver {
  constructor(
    private readonly warehouseRoastedCoffee: WarehouseRoastedCoffeeFeature
  ) {}

  @Query(() => [WarehouseRoastedCoffee])
  async warehouseRoastedCoffees() {
    const test = await this.warehouseRoastedCoffee.getWarehouseRoastedCoffees({
      correlationUuid: v4(),
    });

    return test.coffees;
  }

  @Mutation(() => CommandResult)
  async addRoastedCoffeeLeftOvers(
    @Args('props') props: AddRoastedCoffeeLeftOversInput
  ) {
    await this.warehouseRoastedCoffee.addRoastedCoffeeLeftovers(props);

    return { success: true };
  }

  @Mutation(() => CommandResult)
  async useRoastedCoffeeLeftOvers(
    @Args('props') props: UseRoastedCoffeeLeftOversInput
  ) {
    await this.warehouseRoastedCoffee.useRoastedCoffeeLeftovers(props);

    return { success: true };
  }

  @Mutation(() => CommandResult)
  async adjustRoastedCoffeeLeftOvers(
    @Args('props') props: AdjustRoastedCoffeeLeftOversInput
  ) {
    await this.warehouseRoastedCoffee.adjustRoastedCoffeeLeftovers(props);

    return { success: true };
  }
}
