import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserSaveEvent {
  @Field(() => String)
  eventId: string;

  @Field(() => String)
  username: string;
}
