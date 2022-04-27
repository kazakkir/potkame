import { InputType, Field } from '@nestjs/graphql';
import { Category } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

type EventCategory = typeof Category[keyof typeof Category];

@InputType()
export class CreateEventInput {
  @Matches(/^[a-z0-9!. ]+$/i)
  @MinLength(5, {
    message: 'Title must be at least $constraint1 characters long',
  })
  @MaxLength(100, { message: 'Title is too long' })
  @Field(() => String)
  title: string;

  @IsOptional()
  @MaxLength(3000, { message: 'Description is too long' })
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean, { defaultValue: false })
  private?: boolean;

  @Field(() => Number)
  longitude: number;

  @Field(() => Number)
  latitude: number;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String)
  address: string;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => Date)
  dateFrom: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  dateTo?: Date;

  @IsEnum(Category, { message: '$target is not an enum' })
  @Field({
    description:
      '"SPORT" | "FOOD" | "SHOPPING" | "COMEDY" | "EDUCATION" | "BEAUTY" | "OTHER"',
  })
  category: EventCategory;
}
