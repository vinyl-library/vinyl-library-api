import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/auth/jwt/jwt.constants';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { uuid } from 'uuidv4';

describe('UserController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const USER = {
    id: '',
    username: 'user1',
    name: 'User 1',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, UserModule, JwtModule],
      providers: [JwtStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();

    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    USER.id = uuid();

    await prismaService.user.create({
      data: USER,
    });
  });

  afterEach(async () => {
    await prismaService.user.delete({
      where: {
        id: USER.id,
      },
    });
  });

  describe('GET /user', () => {
    const baseUrl = () => '/user';

    it('should return 200 OK if user logged in', () => {
      const payload = { sub: USER.id, username: USER.username };
      const token = jwtService.sign(payload, { secret: JWT_SECRET });

      return request(app.getHttpServer())
        .get(baseUrl())
        .set('Cookie', [`jwt=${token}`])
        .expect(HttpStatus.OK);
    });
  });

  describe('GET /user/check/:username', () => {
    const baseUrl = (username: string) => `/user/check/${username}`;

    it('should return 200 OK if username available', () => {
      return request(app.getHttpServer())
        .get(baseUrl(USER.username))
        .expect(HttpStatus.OK);
    });

    it('should return 200 OK if username unavailable', () => {
      return request(app.getHttpServer())
        .get(baseUrl('unavailable-username'))
        .expect(HttpStatus.OK);
    });
  });
});
