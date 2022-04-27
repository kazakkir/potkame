import { InputType, Field } from '@nestjs/graphql';
import { IsAlpha, IsAlphanumeric, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsAlphanumeric()
  @MinLength(5, {
    message: 'Username must be at least $constraint1 characters long',
  })
  @Field(() => String)
  username: string;

  @MinLength(5, {
    message: 'Password must be at least $constraint1 characters long',
  })
  @Field(() => String)
  password: string;

  @IsAlpha()
  @MinLength(2, {
    message: 'Name must be at least $constraint1 letters long',
  })
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  imageUrl?: string;
}
