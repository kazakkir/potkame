import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { FindManyArgs } from './dto/find-many.args';
import { UpdateEventInput } from './dto/update-event.input';
import { EventManyResponse } from './dto/find-many.response';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Event, { name: 'eventCreate' })
  createEvent(@Args('args') args: CreateEventInput, @Context() context) {
    const authorId = context.req.user.username;
    return this.eventsService.create(authorId, args);
  }

  @Query(() => EventManyResponse, { name: 'eventMany' })
  async findAll(@Args() args: FindManyArgs) {
    return await this.eventsService.findAll(args);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Event], { name: 'eventManySaved' })
  async findManySaved(@Context() context) {
    const username = context.req.user.username;
    return await this.eventsService.findManySaved(username);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Event], { name: 'eventManyCreated' })
  async findManyCreated(@Context() context) {
    const username = context.req.user.username;
    return await this.eventsService.findManyCreated(username);
  }

  @Query(() => [String], { name: 'eventManyCities' })
  findEventCities() {
    return this.eventsService.findEventCities();
  }

  @Query(() => Event, { name: 'eventOne', nullable: true })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.eventsService.findOne(id);
  }

  @Mutation(() => Event)
  @UseGuards(JwtAuthGuard)
  updateEvent(
    @Args('id', { type: () => String }) id: string,
    @Args('args', { type: () => UpdateEventInput })
    args: UpdateEventInput,
  ) {
    return this.eventsService.update(id, args);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { name: 'saveEvent' })
  saveEvent(
    @Args('eventId', { type: () => String }) eventId: string,
    @Context() context,
  ) {
    const username = context.req.user.username;
    return this.eventsService.addSavedBy(username, eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { name: 'unsaveEvent' })
  unsaveEvent(
    @Args('eventId', { type: () => String }) eventId: string,
    @Context() context,
  ) {
    const username = context.req.user.username;
    return this.eventsService.removeSavedBy(username, eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Boolean, { name: 'eventIsSaved' })
  eventIsSaved(
    @Args('eventId', { type: () => String }) eventId: string,
    @Context() context,
  ) {
    const username = context.req.user.username;
    return this.eventsService.eventIsSaved(username, eventId);
  }

  @Mutation(() => Event)
  @UseGuards(JwtAuthGuard)
  removeEvent(@Args('id', { type: () => String }) id: string) {
    return this.eventsService.remove(id);
  }
}
