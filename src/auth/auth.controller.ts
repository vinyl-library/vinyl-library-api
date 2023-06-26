import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/LoginRequest.dto';
import { RegisterRequestDto } from './dto/RegisterRequest.dto';
import { IsPublic } from 'src/common/decorator/isPublic';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
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
}
