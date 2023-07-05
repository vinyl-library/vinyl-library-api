import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { hashSync } from 'bcrypt';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AuthController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const SALT_ROUNDS = 10;
  const PASSWORD = 'password';
  let TEST_USER = {
    username: 'testuser',
    name: 'testuser',
    password: hashSync(PASSWORD, SALT_ROUNDS),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();

    prismaService = module.get<PrismaService>(PrismaService);

    await prismaService.user.create({
      data: TEST_USER,
    });
  });

  afterEach(async () => {
    await prismaService.user.delete({
      where: {
        username: TEST_USER.username,
      },
    });
  });

  describe('POST /auth/login', () => {
    it('should return 200 OK if login success', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: TEST_USER.username,
          password: PASSWORD,
        })
        .expect(HttpStatus.OK)
        .expect({ message: 'Successfully logged in' });
    });

    it('should return 401 UNAUTHORIZED if username not found', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'wrongusername',
          password: PASSWORD,
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 401 UNAUTHORIZED if password invalid', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: TEST_USER.username,
          password: 'wrongpassword',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
