import { Injectable } from '@nestjs/common';
import { EnrollmentRequestState } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';
import { EventsService } from 'src/events/events.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnrollmentRequestsService {
  constructor(
    private prisma: PrismaService,
    private readonly eventsSerivce: EventsService,
  ) {}

  async create(username: string, eventId: string) {
    const enrollmentReq = await this.prisma.enrollmentRequest.findUnique({
      where: { eventId_username: { eventId, username } },
    });

    if (enrollmentReq) {
      throw new ApolloError('Enrollment request already exists');
    }

    return await this.prisma.enrollmentRequest.create({
      data: {
        event: {
          connect: {
            id: eventId,
          },
        },
        user: {
          connect: {
            username,
          },
        },
      },
    });
  }

  async findOne(username: string, eventId: string) {
    return await this.prisma.enrollmentRequest.findFirst({
      where: {
        username,
        eventId,
      },
    });
  }

  async findAll(username: string) {
    return await this.prisma.enrollmentRequest.findMany({
      where: { username },
    });
  }

  async findAllAsHost(username: string, state: EnrollmentRequestState) {
    return await this.prisma.enrollmentRequest.findMany({
      where: { state, event: { authorUsername: username } },
    });
  }

  async accept(username: string, eventId: string) {
    return await this.eventsSerivce.addParticipant(username, eventId).then(() =>
      this.prisma.enrollmentRequest.update({
        where: { eventId_username: { eventId, username } },
        data: { state: 'ACCEPTED' },
      }),
    );
  }

  async decline(username: string, eventId: string) {
    return await this.prisma.enrollmentRequest.update({
      where: { eventId_username: { eventId, username } },
      data: { state: 'DECLINED' },
    });
  }
}
