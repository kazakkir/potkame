import { Module } from '@nestjs/common';
import { GqlContextType, GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { CommentsModule } from './comments/comments.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { EnrollmentRequestsModule } from './enrollmentRequests/enrollment-requests.module';
import { PubsubModule } from './pubsub/pubsub.module';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      debug: false,
      cors: {
        origin: [
          'https://studio.apollographql.com',
          'http://localhost:4000/graphql',
          'http://localhost:3000',
        ],
        credentials: true,
      },
      context: ({ req, res }) => ({
        req,
        res,
      }),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      subscriptions: {
        'graphql-ws': true,
      },
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.extensions?.exception?.code || error.message,
        };
        return graphQLFormattedError;
      },
    }),

    UsersModule,
    PrismaModule,
    AuthModule,
    EventsModule,
    CommentsModule,
    EnrollmentRequestsModule,
    PubsubModule,
  ],
})
export class AppModule {}
