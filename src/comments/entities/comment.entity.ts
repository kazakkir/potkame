import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Comment {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => String)
  content: string;

  @Field(() => String)
  eventId: string;

  @Field(() => String, { nullable: true })
  parentCommentId: string;

  @Field(() => String)
  authorUsername: string;

  @Field(() => [User], { nullable: true })
  likedBy: User[];
}
