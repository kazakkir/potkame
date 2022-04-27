import { ObjectType, Field } from '@nestjs/graphql';
import { Comment } from 'src/comments/entities/comment.entity';
import { EnrollmentRequest } from 'src/enrollmentRequests/entities/enrollment-request.entity';
import { Event } from 'src/events/entities/event.entity';
import { UserEnrollEvent } from 'src/enrollmentRequests/entities/user-enroll-event.entity';
import { UserSaveEvent } from 'src/events/entities/user-save-event.entity';

@ObjectType()
export class User {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;

  @Field(() => String)
  username: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => [Event], { defaultValue: [] })
  eventCreatedMany?: Event[];

  @Field(() => [UserSaveEvent], { nullable: true })
  eventSavedMany?: UserSaveEvent[];

  @Field(() => [UserEnrollEvent], { nullable: true })
  eventEnrolledMany?: UserEnrollEvent[];

  @Field(() => [EnrollmentRequest], { nullable: true })
  eventRequestedMany?: EnrollmentRequest[];

  @Field(() => [Comment], { nullable: true })
  commentCreatedMany?: Comment[];

  @Field(() => [Comment], { nullable: true })
  commentLikedMany?: Comment[];

  @Field(() => [User], { nullable: true })
  followedBy?: User[];

  @Field(() => [User], { nullable: true })
  following?: User[];
}
