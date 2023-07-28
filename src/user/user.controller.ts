import { Controller, Get, Param, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { IsPublic } from 'src/common/decorator/isPublic';
import { Request } from 'express';

interface User {
  id: string;
  username: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Req() request: Request) {
    const requestUser = request.user as User;

    const user = await this.userService.getUser(requestUser.username);

    return {
      message: 'Successfully get user',
      data: user,
    };
  }

  @IsPublic()
  @Get('/check/:username')
  async checkAvailable(@Param('username') username: string) {
    const status = await this.userService.checkAvailable(username);

    return {
      message: status ? 'Username available' : 'Username unavailable',
      data: {
        status,
      },
    };
  }
}
