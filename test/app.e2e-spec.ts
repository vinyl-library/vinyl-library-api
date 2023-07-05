import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/auth/jwt/jwt.constants';
import cookieParser from 'cookie-parser';

describe('AppController', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, JwtModule],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  describe('GET /', () => {
    it('should return 200 OK with message "Hello World!"', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(HttpStatus.OK)
        .expect('Hello World!');
    });
  });

  describe('GET /protected', () => {
    it('should return 200 OK with message "Authenticated!" if authenticated', () => {
      const payload = { sub: 'id', username: 'username' };
      const token = jwtService.sign(payload, { secret: JWT_SECRET });

      return request(app.getHttpServer())
        .get('/protected')
        .set('Cookie', [`jwt=${token}`])
        .expect(HttpStatus.OK)
        .expect('Authenticated!');
    });

    it('should return 401 UNAUTHORIZED if not authenticated', () => {
      return request(app.getHttpServer())
        .get('/protected')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
