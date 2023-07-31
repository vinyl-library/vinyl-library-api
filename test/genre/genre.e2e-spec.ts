import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { GenreModule } from 'src/genre/genre.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { uuid } from 'uuidv4';

describe('GenreController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const GENRE_1 = {
    id: '',
    name: 'Genre 1',
  };
  const GENRE_2 = {
    id: 'g',
    name: 'Genre 2',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GenreModule],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();

    prismaService = module.get<PrismaService>(PrismaService);

    GENRE_1.id = uuid();
    GENRE_2.id = uuid();

    await prismaService.genre.createMany({
      data: [GENRE_1, GENRE_2],
    });
  });

  afterEach(async () => {
    await prismaService.genre.deleteMany({
      where: {
        id: {
          in: [GENRE_1.id, GENRE_2.id],
        },
      },
    });
  });

  describe('GET /genre', () => {
    const baseUrl = '/genre';

    it('should return 200 OK if success', () => {
      return request(app.getHttpServer()).get(baseUrl).expect(HttpStatus.OK);
    });
  });

  describe('GET /genre/:genreId', () => {
    const baseUrl = '/genre';

    it('should return 200 OK if success', () => {
      return request(app.getHttpServer())
        .get(baseUrl + `/${GENRE_1.id}`)
        .expect(HttpStatus.OK);
    });

    it('should return 400 BAD REQUEST if genre id invalid', () => {
      return request(app.getHttpServer())
        .get(baseUrl + '/invalid-id')
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /genre', () => {
    const baseUrl = '/genre';

    it('should return 201 CREATED', () => {
      return request(app.getHttpServer())
        .post(baseUrl)
        .send({
          name: 'Genre',
        })
        .expect(HttpStatus.CREATED);
    });
  });
});
