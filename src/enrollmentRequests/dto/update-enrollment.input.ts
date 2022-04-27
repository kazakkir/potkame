import { CreateEnrollmentRequestInput } from './create-enrollment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEnrollmentRequestInput extends PartialType(
  CreateEnrollmentRequestInput,
) {
  @Field(() => Int)
  id: number;
}
