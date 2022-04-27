import { InputType, Field } from '@nestjs/graphql';
import { LoginUserInput } from './login-user.input';

@InputType()
export class RegisterUserInput extends LoginUserInput {
  @Field()
  name: string;
}
