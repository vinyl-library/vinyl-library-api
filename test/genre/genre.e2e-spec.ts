import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { GenreModule } from 'src/genre/genre.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('GenreController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const GENRE_1 = {
    id: 'genre_1',
    name: 'Genre 1',
  };
  const GENRE_2 = {
    id: 'genre_2',
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
});
