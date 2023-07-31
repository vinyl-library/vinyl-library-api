import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('GenreService', () => {
  let genreService: GenreService;

  const prismaServiceMock = {
    genre: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
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
      const GENRES = [
        {
          id: 'genre1',
          name: 'Genre 1',
        },
        {
          id: 'genre2',
          name: 'Genre 2',
        },
      ];

      prismaServiceMock.genre.findMany.mockResolvedValue(GENRES);

      // act
      const result = await genreService.allGenre();

      // assert
      expect(result).toEqual({ genre: GENRES });
      expect(prismaServiceMock.genre.findMany).toBeCalledWith();
    });
  });

  describe('get genre', () => {
    it('should return genre detail if genre exists', async () => {
      // setup
      const GENRE = {
        id: 'genreId',
        name: 'Genre',
        _count: {
          books: 2,
        },
      };

      prismaServiceMock.genre.findFirst.mockResolvedValue(GENRE);

      // act
      const result = await genreService.getGenre(GENRE.id);

      // assert
      expect(result).toEqual({
        id: GENRE.id,
        name: GENRE.name,
        bookCount: GENRE._count.books,
      });
      expect(prismaServiceMock.genre.findFirst).toBeCalledWith({
        where: {
          id: GENRE.id,
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              books: true,
            },
          },
        },
      });
    });

    it('should throw Bad Request Exception if genre id invalid', async () => {
      // setup
      const genreId = 'invalidId';

      prismaServiceMock.genre.findFirst.mockResolvedValue(null);

      // act and assert
      await expect(genreService.getGenre(genreId)).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaServiceMock.genre.findFirst).toBeCalledWith({
        where: {
          id: genreId,
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              books: true,
            },
          },
        },
      });
    });
  });
});
