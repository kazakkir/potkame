import { CacheModule, Module } from '@nestjs/common';
import { EnrollmentRequestsService } from './enrollment-requests.service';
import { EnrollmentsResolver } from './enrollment-requests.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { EventsService } from 'src/events/events.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 120,
      }),
    }),
  ],
  providers: [
    EnrollmentsResolver,
    EnrollmentRequestsService,
    PrismaService,
    EventsService,
  ],
  exports: [EnrollmentRequestsService],
})
export class EnrollmentRequestsModule {}
