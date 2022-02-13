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
} from '@nestjs/graphql';

import { RoastingFeature } from '../modules/roasting/features/roasting-feature';
import { CommandResult } from './dtos';

@ObjectType()
class Roasting {
  @Field(() => ID)
  uuid: string;

  @Field()
  roastingDate: string;
}

@InputType()
class CreateRoastingInput {
  @Field(() => ID)
  uuid: string;

  @Field()
  roastingDate: string;

  @Field()
  correlationUuid: string;
}

@Resolver(() => Roasting)
export class RoastingResolver {
  constructor(private readonly roasting: RoastingFeature) {}

  @Query(() => [Roasting])
  async roastings() {
    return [];
  }

  @Mutation(() => CommandResult)
  async createRoasting(@Args('props') props: CreateRoastingInput) {
    await this.roasting.createRoasting(props);

    return { success: true };
  }
}
