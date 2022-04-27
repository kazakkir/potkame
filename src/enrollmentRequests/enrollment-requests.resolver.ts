import { Inject, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Subscription,
} from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { EnrollmentRequestsService } from './enrollment-requests.service';
import { EnrollmentRequest } from './entities/enrollment-request.entity';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { EventsService } from 'src/events/events.service';
import { EnrollmentRequestState } from '@prisma/client';

const ENROLLMENT_REQUESTED_EVENT = 'enrollmentRequested';
const ENROLLMENT_DECLINED_EVENT = 'enrollmentRequestDeclined';
const ENROLLMENT_ACCEPTED_EVENT = 'enrollmentRequestAccepted';

@Resolver(() => EnrollmentRequest)
export class EnrollmentsResolver {
  constructor(
    private readonly enrollmentRequestsService: EnrollmentRequestsService,
    private readonly eventsService: EventsService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => EnrollmentRequest, { name: 'enrollmentRequestCreateOne' })
  async create(@Context() context, @Args('eventId') eventId: string) {
    const username = context.req.user.username;
    const event = await this.eventsService.findOne(eventId);
    const enrollmentRequest = await this.enrollmentRequestsService.create(
      username,
      eventId,
    );
    this.pubSub.publish(ENROLLMENT_REQUESTED_EVENT, {
      enrollmentRequested: enrollmentRequest,
      hostUsername: event.authorUsername,
    });
    return enrollmentRequest;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => EnrollmentRequest, {
    nullable: true,
    name: 'enrollmentRequestOne',
  })
  findOne(
    @Args('eventId', { type: () => String }) eventId: string,
    @Context() context,
  ) {
    const username = context.req.user.username;
    return this.enrollmentRequestsService.findOne(username, eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [EnrollmentRequest], { name: 'enrollmentRequestMany' })
  findAll(@Context() context) {
    const username = context.req.user.username;
    return this.enrollmentRequestsService.findAll(username);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [EnrollmentRequest], { name: 'enrollmentRequestManyAsHost' })
  findAllAsHost(
    @Args('state', {
      nullable: true,
    })
    state: EnrollmentRequestState,
    @Context() context,
  ) {
    const username = context.req.user.username;
    return this.enrollmentRequestsService.findAllAsHost(username, state);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { name: 'enrollmentRequestAcceptOne' })
  async accept(
    @Args('username', { type: () => String }) username: string,
    @Args('eventId', { type: () => String }) eventId: string,
  ) {
    const enrollmentRequestAccepted =
      await this.enrollmentRequestsService.accept(username, eventId);

    if (enrollmentRequestAccepted) {
      this.pubSub.publish(ENROLLMENT_ACCEPTED_EVENT, {
        enrollmentRequestAccepted,
      });
      return true;
    }

    return false;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { name: 'enrollmentRequestDeclineOne' })
  async decline(
    @Args('username', { type: () => String }) username: string,
    @Args('eventId', { type: () => String }) eventId: string,
  ) {
    const enrollmentRequestDeclined =
      await this.enrollmentRequestsService.decline(username, eventId);

    if (enrollmentRequestDeclined) {
      this.pubSub.publish(ENROLLMENT_DECLINED_EVENT, {
        enrollmentRequestDeclined,
      });
      return true;
    }

    return false;
  }

  @Subscription(() => EnrollmentRequest, {
    filter: (payload, variables) => payload.hostUsername === variables.username,
  })
  enrollmentRequested(@Args('username') username: string) {
    return this.pubSub.asyncIterator(ENROLLMENT_REQUESTED_EVENT);
  }

  @Subscription(() => EnrollmentRequest, {
    filter: (payload, variables) =>
      payload.enrollmentRequestAccepted.username === variables.username,
  })
  enrollmentRequestAccepted(@Args('username') username: string) {
    return this.pubSub.asyncIterator(ENROLLMENT_ACCEPTED_EVENT);
  }

  @Subscription(() => EnrollmentRequest, {
    filter: (payload, variables) => {
      console.log(
        payload,
        variables,
        payload.enrollmentRequestDeclined.username === variables.username,
      );
      return payload.enrollmentRequestDeclined.username === variables.username;
    },
  })
  enrollmentRequestDeclined(@Args('username') username: string) {
    return this.pubSub.asyncIterator(ENROLLMENT_DECLINED_EVENT);
  }
}
