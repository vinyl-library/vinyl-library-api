import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/LoginRequest.dto';
import { RegisterRequestDto } from './dto/RegisterRequest.dto';
import { Response } from 'express';
import { IsPublic } from '../common/decorator/isPublic';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Body() loginRequestDto: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.login(loginRequestDto);

    response.cookie('jwt', token, { httpOnly: true });

    return {
      message: 'Successfully logged in',
    };
  }

  @IsPublic()
  @Post('/register')
  async register(@Body() registerRequestDto: RegisterRequestDto) {
    await this.authService.register(registerRequestDto);
    return {
      message: 'Successfully registered',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt', { httpOnly: true });

    return {
      message: 'Successfully logged out',
    };
  }

  @IsPublic()
  @Get('/check/:username')
  async checkAvailable(@Param('username') username: string) {
    const status = await this.authService.checkAvailable(username);

    return {
      message: status ? 'Username available' : 'Username unavailable',
      data: {
        status,
      },
    };
  }
}
