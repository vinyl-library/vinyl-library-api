import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';

describe('UserController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const USER = {
    id: 'user1',
    username: 'user1',
    name: 'User 1',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();

    prismaService = module.get<PrismaService>(PrismaService);

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

  describe('GET /user/check/:username', () => {
    const baseUrl = '/user/check';

    it('should return 200 OK if username available', () => {
      return request(app.getHttpServer())
        .get(baseUrl + `/${USER.username}`)
        .expect(HttpStatus.OK);
    });

    it('should return 200 OK if username unavailable', () => {
      return request(app.getHttpServer())
        .get(baseUrl + '/unavailable-username')
        .expect(HttpStatus.OK);
    });
  });
});
