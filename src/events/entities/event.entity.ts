import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Comment } from 'src/comments/entities/comment.entity';
import { EnrollmentRequest } from 'src/enrollmentRequests/entities/enrollment-request.entity';
import { UserEnrollEvent } from '../../enrollmentRequests/entities/user-enroll-event.entity';
import { UserSaveEvent } from './user-save-event.entity';

enum Category {
  SPORT = 'SPORT',
  FOOD = 'FOOD',
  SHOPPING = 'SHOPPING',
  COMEDY = 'COMEDY',
  EDUCATION = 'EDUCATION',
  BEAUTY = 'BEAUTY',
  OTHER = 'OTHER',
}

registerEnumType(Category, { name: 'Category' });

@ObjectType()
export class Event {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Category, { defaultValue: Category.OTHER })
  category: Category;

  @Field(() => String, { defaultValue: false })
  private: string;

  @Field(() => Number)
  longitude: number;

  @Field(() => Number)
  latitude: number;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String)
  address: string;

  @Field(() => String, { nullable: true })
  imageUrl: string;

  @Field(() => Date)
  dateFrom: Date;

  @Field(() => Date, { nullable: true })
  dateTo: Date;

  @Field(() => String)
  authorUsername: string;

  @Field(() => [UserSaveEvent], { nullable: true })
  savedBy?: UserSaveEvent[];

  @Field(() => [UserEnrollEvent], { nullable: true })
  participants?: UserEnrollEvent[];

  @Field(() => [EnrollmentRequest])
  requests?: EnrollmentRequest[];

  @Field(() => [Comment], { nullable: true })
  comments: Comment[];
}
