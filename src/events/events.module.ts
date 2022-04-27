import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [EventsResolver, EventsService, PrismaService, UsersService],
  exports: [EventsService],
})
export class EventsModule {}
