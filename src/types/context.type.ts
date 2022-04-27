import { GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { User } from 'src/users/entities/user.entity';

export type Ctx = GqlExecutionContext & {
  req: Request;
  res: Response;
  user: User;
};
