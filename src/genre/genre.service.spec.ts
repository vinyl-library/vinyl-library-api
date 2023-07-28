import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('GenreService', () => {
  let genreService: GenreService;

  const prismaServiceMock = {
    genre: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenreService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    genreService = module.get<GenreService>(GenreService);
  });

  describe('all genre', () => {
    it('should return all genre', async () => {
      // setup
      const genres = [
        {
          id: 'genre1',
          name: 'Genre 1',
        },
        {
          id: 'genre2',
          name: 'Genre 2',
        },
      ];

      prismaServiceMock.genre.findMany.mockResolvedValue(genres);

      // act
      const result = await genreService.allGenre();

      // assert
      expect(result).toEqual({ genre: genres });
      expect(prismaServiceMock.genre.findMany).toBeCalledWith();
    });
  });
});
