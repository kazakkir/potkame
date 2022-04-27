import { ArgsType, Field, InputType, Int, OmitType } from '@nestjs/graphql';

@InputType()
class SearchArgs {
  @Field(() => String, { nullable: true })
  field?: string;

  @Field(() => String, { nullable: true })
  value?: string;
}

@InputType()
class OrderByArgs {
  @Field(() => String, { nullable: true })
  field?: string;

  @Field(() => String, { nullable: true })
  direction?: string;
}

@InputType()
class DateOperators {
  @Field(() => Date, { nullable: true, description: 'Greater than or equal' })
  gte?: Date;

  @Field(() => Date, { nullable: true, description: 'Lower than' })
  lt?: Date;
}
@InputType()
class DateArgs {
  @Field({ nullable: true })
  field?: string;

  @Field({ nullable: true })
  value?: DateOperators;
}

@InputType()
class WhereArgs {
  @Field(() => String, { nullable: true })
  field?: string;

  @Field(() => String, { nullable: true })
  value?: string;
}

@InputType()
class PaginationArgs {
  @Field({ nullable: true })
  cursor?: string;

  @Field()
  take: number;
}

@ArgsType()
export class FindManyArgs {
  @Field({ nullable: true })
  pagination?: PaginationArgs;

  @Field({ nullable: true })
  search?: SearchArgs;

  @Field({ nullable: true })
  orderBy?: OrderByArgs;

  @Field(() => [WhereArgs], { nullable: true, defaultValue: [] })
  filters?: WhereArgs[];

  @Field({ nullable: true })
  date?: DateArgs;
}
