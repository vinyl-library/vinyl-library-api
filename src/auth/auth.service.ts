import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginRequestDto } from './dto/LoginRequest.dto';
import { RegisterRequestDto } from './dto/RegisterRequest.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login({ username, password }: LoginRequestDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      throw new BadRequestException({ message: 'Username not found' });
    }

    if (user.password !== password) {
      throw new BadRequestException({ message: 'Invalid password' });
    }

    return user;
  }

  async register({ username, name, password }: RegisterRequestDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!!user) {
      throw new BadRequestException({ message: 'Username already taken' });
    }

    await this.prisma.user.create({ data: { username, name, password } });
  }
}
