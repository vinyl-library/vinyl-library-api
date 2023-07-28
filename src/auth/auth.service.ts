import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequestDto } from './dto/LoginRequest.dto';
import { RegisterRequestDto } from './dto/RegisterRequest.dto';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login({ username, password }: LoginRequestDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      throw new UnauthorizedException({ message: 'Username not found' });
    }

    if (compareSync(password, user.password)) {
      const payload = { sub: user.id, username: user.username };
      return this.jwtService.sign(payload);
    } else {
      throw new UnauthorizedException({ message: 'Invalid password' });
    }
  }

  async register({
    username,
    name,
    password,
    favoriteGenre,
  }: RegisterRequestDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!!user) {
      throw new BadRequestException({ message: 'Username already taken' });
    }

    const genreFound = (
      await this.prisma.genre.findMany({
        where: {
          id: {
            in: favoriteGenre,
          },
        },
      })
    ).map((genre) => genre.id);

    if (genreFound.length !== favoriteGenre.length) {
      throw new BadRequestException({
        message: `Some genre id are not found`,
        id: favoriteGenre.filter((id) => !genreFound.includes(id)),
      });
    }

    const SALT_ROUNDS = 10;
    const encryptedPassword = hashSync(password, SALT_ROUNDS);
    await this.prisma.user.create({
      data: {
        username,
        name,
        password: encryptedPassword,
        favoriteGenre: {
          connect: favoriteGenre.map((genreId) => {
            return { id: genreId };
          }),
        },
      },
    });
  }

  async checkAvailable(username: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    return !user;
  }
}
