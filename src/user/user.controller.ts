import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { IsPublic } from 'src/common/decorator/isPublic';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
