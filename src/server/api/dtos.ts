import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommandResult {
  @Field()
  success: boolean;
}
