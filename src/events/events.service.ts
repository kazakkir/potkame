import { Injectable } from '@nestjs/common';
import { UserInputError } from 'apollo-server-express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventInput } from './dto/create-event.input';
import { FindManyArgs } from './dto/find-many.args';
import { UpdateEventInput } from './dto/update-event.input';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(authorUsername: string, createEventInput: CreateEventInput) {
    return await this.prisma.event
      .create({
        data: {
          ...createEventInput,
          author: {
            connect: {
              username: authorUsername,
            },
          },
        },
      })
      .catch((err) => console.log(`Error: ${err}`));
  }

  async findAll(findManyArgs: FindManyArgs) {
    const { orderBy, filters, search, date, pagination } = findManyArgs;

    const where = {};

    filters.forEach((a) => {
      where[a.field] = a.value;
    });

    if (search && search.value) {
      const val = search.value
        .replace(/[()|&:*!]/g, ' ')
        .trim()
        .split(/\s+/)
        .join('|');

      where[search.field] = { search: val };
    }

    if (date && date.value) {
      let dateOperators = {}; // gte, lte, gt, lt, eq
      Object.entries(date.value).forEach(([key, value]) => {
        dateOperators = { ...dateOperators, [key]: new Date(value) };
      });

      where[date.field] = dateOperators;
    }

    const paginationArgs: any = {};
    if (pagination) {
      paginationArgs.take = pagination.take;

      if (pagination.cursor) {
        paginationArgs.cursor = { id: pagination.cursor };
        paginationArgs.skip = 1;
      }
    }

    const dateFrom = { gte: new Date() };

    const eventAggregations = await this.prisma.event.aggregate({
      where: { ...where, AND: { dateFrom } }, // filter out expired events
      _count: true,
    });

    const paginatedEvents = await this.prisma.event.findMany({
      ...paginationArgs,
      orderBy: orderBy && { [orderBy.field]: orderBy.direction },
      where: { ...where, AND: { dateFrom } }, // filter out expired events
    });

    return {
      events: paginatedEvents,
      totalCount: eventAggregations._count,
    };
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new UserInputError('Event does not exist');
    }

    return event;
  }

  async findEventCities() {
    const cityObjectArray: { city: string }[] =
      await this.prisma.event.findMany({
        select: { city: true },
        distinct: ['city'],
      });

    return cityObjectArray.map((obj) => obj.city);
  }

  async findManySaved(username: string) {
    return await this.prisma.event.findMany({
      where: { savedBy: { some: { username: username } } },
    });
  }

  async findManyCreated(username: string) {
    return await this.prisma.event.findMany({
      where: {
        authorUsername: username,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, data: UpdateEventInput) {
    return await this.prisma.event.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.event.delete({ where: { id } });
  }

  async addParticipant(username: string, eventId: string) {
    return await this.prisma.userEnrollEvent.create({
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

  async addSavedBy(username: string, eventId: string) {
    return await this.prisma.userSaveEvent
      .create({
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
      })
      .then(() => true)
      .catch(() => false);
  }

  async removeSavedBy(username: string, eventId: string) {
    return await this.prisma.userSaveEvent
      .delete({
        where: { eventId_username: { eventId, username } },
      })
      .then(() => true)
      .catch(() => false);
  }

  async eventIsSaved(username: string, eventId: string) {
    const event = await this.prisma.userSaveEvent.findUnique({
      where: {
        eventId_username: { eventId, username },
      },
    });

    if (event) {
      return true;
    }

    return false;
  }
}
