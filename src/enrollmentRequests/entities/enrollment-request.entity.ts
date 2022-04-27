import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

enum State {
  PROCESSING = 'PROCESSING',
  DECLINED = 'DECLINED',
  ACCEPTED = 'ACCEPTED',
}

registerEnumType(State, { name: 'State' });
@ObjectType()
export class EnrollmentRequest {
  @Field(() => String)
  eventId: string;

  @Field(() => String)
  username: string;

  @Field(() => State, { defaultValue: State.PROCESSING })
  state: State;
}
