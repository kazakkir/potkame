import { Request, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Ctx } from 'src/types/context.type';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { RegisterUserInput } from './dto/register-user.input';
import { GqlAuthGuard } from './gql-auth.guard';
@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context: Ctx,
  ) {
    return this.authService.login(context.user, context.res);
  }

  @Mutation(() => User)
  async register(
    @Args('registerUserInput') registerUserInput: RegisterUserInput,
    @Context() context: Ctx,
  ) {
    return await this.authService.register(registerUserInput, context.res);
  }

  @Mutation(() => Boolean)
  async logout(@Context() ctx: Ctx) {
    ctx.res.clearCookie('uid');
    return true;
  }
}
