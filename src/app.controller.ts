import { Controller, Get } from '@nestjs/common';
import { IsPublic } from './common/decorator/isPublic';

@Controller()
export class AppController {
  constructor() {}

  @IsPublic()
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('/protected')
  getProtected(): string {
    return 'Authenticated!';
  }
}
