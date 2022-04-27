// is used to validate if a user is in a database, if his login credentials are valid

import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RegisterUserInput } from './dto/register-user.input';
import { Response } from 'express';
import { UserInputError } from 'apollo-server-express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UserInputError('Username or password is not correct');
    }

    const passwordMatches = await argon2.verify(user.password, password);

    if (passwordMatches) {
      const { password, ...rest } = user;
      return rest;
    }

    throw new UserInputError('Username or password is not correct');
  }

  login(user: User, response: Response): User {
    this.#saveJwtToCookie(user, response);
    return user;
  }

  async register(
    registerUserInput: RegisterUserInput,
    response: Response,
  ): Promise<User> {
    const hashedPassword = await argon2.hash(registerUserInput.password);
    const existingUser = await this.usersService.findOne(
      registerUserInput.username,
    );

    if (existingUser) {
      throw new UserInputError('Username is taken');
    }

    const user = await this.usersService.create({
      name: registerUserInput.name,
      username: registerUserInput.username,
      password: hashedPassword,
    });

    this.#saveJwtToCookie(user, response);
    return user;
  }

  async #saveJwtToCookie(user: User, response: Response) {
    const jwt = this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });

    response.cookie('uid', jwt, {
      httpOnly: true,
      maxAge: 86400000,
    });
  }
}
