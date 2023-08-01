import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import randomstring from 'randomstring';
import { hashSync } from 'bcrypt';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/auth/jwt/jwt.constants';
import { uuid } from 'uuidv4';

describe('AuthController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const SALT_ROUNDS = 10;
  const PASSWORD = 'password';
  const GENRE_1 = {
    id: '',
    name: 'Genre 1',
  };
  const GENRE_2 = {
    id: '',
    name: 'Genre 2',
  };
  const TEST_USER = {
    username: '',
    name: 'testuser',
    password: hashSync(PASSWORD, SALT_ROUNDS),
  };
  const ANOTHER_USER = {
    username: '',
    name: 'Another User',
    password: 'password',
    favoriteGenre: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, JwtModule],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();

    prismaService = module.get<PrismaService>(PrismaService);

    GENRE_1.id = uuid();
    GENRE_2.id = uuid();
    TEST_USER.username = randomstring.generate(5);
    ANOTHER_USER.username = randomstring.generate(5);
    ANOTHER_USER.favoriteGenre = [GENRE_1.id, GENRE_2.id];

    await prismaService.user.create({
      data: TEST_USER,
    });

    await prismaService.genre.createMany({
      data: [GENRE_1, GENRE_2],
    });
  });

  afterEach(async () => {
    await prismaService.user.deleteMany({
      where: {
        username: {
          in: [TEST_USER.username, ANOTHER_USER.username],
        },
      },
    });

    await prismaService.genre.deleteMany({
      where: {
        id: {
          in: [GENRE_1.id, GENRE_2.id],
        },
      },
    });
  });

  describe('POST /auth/login', () => {
    const baseUrl = () => '/auth/login';

    it('should return 200 OK if login success', () => {
      return request(app.getHttpServer())
        .post(baseUrl())
        .send({
          username: TEST_USER.username,
          password: PASSWORD,
        })
        .expect(HttpStatus.OK)
        .expect({ message: 'Successfully logged in' });
    });

    it('should return 401 UNAUTHORIZED if username not found', () => {
      return request(app.getHttpServer())
        .post(baseUrl())
        .send({
          username: 'wrongusername',
          password: PASSWORD,
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 401 UNAUTHORIZED if password invalid', () => {
      return request(app.getHttpServer())
        .post(baseUrl())
        .send({
          username: TEST_USER.username,
          password: 'wrongpassword',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /auth/register', () => {
    const baseUrl = () => '/auth/register';

    it('should return 201 CREATED if register success', () => {
      return request(app.getHttpServer())
        .post(baseUrl())
        .send(ANOTHER_USER)
        .expect(HttpStatus.CREATED);
    });

    it('should return 400 BAD REQUEST if username already exists', () => {
      return request(app.getHttpServer())
        .post(baseUrl())
        .send({
          username: TEST_USER.username,
          name: 'Another Test User',
          password: 'password',
          favoriteGenre: [],
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 BAD REQUEST if genre not found', () => {
      ANOTHER_USER.favoriteGenre.push('invalid_genre');

      return request(app.getHttpServer())
        .post(baseUrl())
        .send(ANOTHER_USER)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /auth/logout', () => {
    const baseUrl = () => '/auth/logout';

    it('should return 200 OK if successfully logged out', () => {
      const payload = { sub: 'id', username: 'username' };
      const token = jwtService.sign(payload, { secret: JWT_SECRET });

      return request(app.getHttpServer())
        .post(baseUrl())
        .set('Cookie', [`jwt=${token}`])
        .expect(HttpStatus.OK);
    });
  });
});
