import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserEnrollEvent {
  @Field(() => String)
  eventId: string;

  @Field(() => String)
  username: string;
}
