import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEnrollmentRequestInput {
  @Field(() => String)
  eventId: string;
}
