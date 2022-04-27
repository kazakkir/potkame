import { Field, ObjectType } from '@nestjs/graphql';
import { Event } from '../entities/event.entity';

@ObjectType()
export class EventManyResponse {
  @Field(() => [Event])
  events: Event[];

  @Field(() => Number, { defaultValue: 0 })
  totalCount: number;
}
