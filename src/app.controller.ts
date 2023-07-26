import { Controller, Get } from '@nestjs/common';
import { IsPublic } from './common/decorator/isPublic';

@Controller()
export class AppController {
  constructor() {}

  @IsPublic()
  @Get()
  getHello() {
    return { message: 'Hello World!' };
  }

  @Get('/protected')
  getProtected() {
    return { message: 'Authenticated!' };
  }
}
