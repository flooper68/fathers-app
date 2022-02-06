import {
  Field,
  ObjectType,
  Resolver,
  Mutation,
  InputType,
  Float,
  Args,
  Query,
  ID,
  Int,
} from '@nestjs/graphql';
import { v4 } from 'uuid';

import { RoastingSettingsFeature } from './../modules/roasting/features/roasting-settings-feature';
import { CommandResult } from './dtos';

@ObjectType()
class GreenCoffee {
  @Field(() => ID)
  uuid: string;

  @Field()
  name: string;

  @Field(() => Float)
  batchWeight: number;

  @Field(() => Float)
  roastingLossFactor: number;
}

@ObjectType()
class RoastedCoffee {
  @Field(() => ID)
  uuid: string;

  @Field()
  name: string;

  @Field(() => ID)
  greenCoffeeUuid: string;
}

@ObjectType()
class ProductVariations {
  @Field(() => Int)
  id: number;

  @Field(() => Float)
  weight: number;

  @Field(() => ID)
  roastedCoffeeUuid: string;
}

@ObjectType()
class RoastingSettings {
  @Field(() => [GreenCoffee])
  greenCoffees: GreenCoffee[];

  @Field(() => [RoastedCoffee])
  roastedCoffees: RoastedCoffee[];

  @Field(() => [ProductVariations])
  productVariations: ProductVariations[];
}

@InputType()
class AddGreenCoffeeInput {
  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field(() => Float)
  batchWeight: number;

  @Field(() => Float)
  roastingLossFactor: number;

  @Field()
  correlationUuid: string;
}

@InputType()
class UpdateGreenCoffeeInput {
  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field(() => Float)
  batchWeight: number;

  @Field(() => Float)
  roastingLossFactor: number;

  @Field()
  correlationUuid: string;
}

@InputType()
class AddRoastedCoffeeInput {
  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field(() => ID)
  greenCoffeeUuid: string;

  @Field()
  correlationUuid: string;
}

@InputType()
class UpdateRoastedCoffeeInput {
  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field(() => ID)
  greenCoffeeUuid: string;

  @Field()
  correlationUuid: string;
}

@InputType()
class AssignProductVariationInput {
  @Field(() => ID)
  id: number;

  @Field(() => Float)
  weight: number;

  @Field()
  roastedCoffeeUuid: string;

  @Field()
  correlationUuid: string;
}

@Resolver(() => RoastingSettings)
export class RoastingSettingsResolver {
  constructor(private readonly roastinSettings: RoastingSettingsFeature) {}

  @Query(() => RoastingSettings)
  async roastingSettings() {
    return this.roastinSettings.getRoastingSettings({
      correlationUuid: v4(),
    });
  }

  @Mutation(() => CommandResult)
  async addGreenCoffee(@Args('props') props: AddGreenCoffeeInput) {
    await this.roastinSettings.addGreenCoffee(props);

    return { success: true };
  }

  @Mutation(() => CommandResult)
  async updateGreenCoffee(@Args('props') props: UpdateGreenCoffeeInput) {
    await this.roastinSettings.updateGreenCoffee(props);

    return { success: true };
  }

  @Mutation(() => CommandResult)
  async addRoastedCoffee(@Args('props') props: AddRoastedCoffeeInput) {
    await this.roastinSettings.addRoastedCoffee(props);

    return { success: true };
  }

  @Mutation(() => CommandResult)
  async updateRoastedCoffee(@Args('props') props: UpdateRoastedCoffeeInput) {
    await this.roastinSettings.updateRoastedCoffee(props);

    return { success: true };
  }

  @Mutation(() => CommandResult)
  async assignProductVariation(
    @Args('props') props: AssignProductVariationInput
  ) {
    await this.roastinSettings.assignProductVariation(props);

    return { success: true };
  }
}
