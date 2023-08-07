import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AddBookRequestDto } from './dto/AddBookRequest.dto';
import * as uuid from 'uuidv4';
import { BadRequestException } from '@nestjs/common';

describe('BookService', () => {
  let bookService: BookService;

  const prismaServiceMock = {
    book: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    genre: {
      findMany: jest.fn(),
    },
  };

  const cloudinaryServiceMock = {
    uploadBookCover: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: CloudinaryService,
          useValue: cloudinaryServiceMock,
        },
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
  });

  describe('add book', () => {
    const DTO: AddBookRequestDto = {
      title: 'Title',
      author: 'Author',
      publisher: 'Publisher',
      publishDate: new Date(),
      description: 'Description',
      genre: ['genre1', 'genre2'],
      pages: 123,
      stock: 3,
    };

    const FILE_MOCK: Partial<Express.Multer.File> = {};

    it('should upload cover and create new book if success', async () => {
      // setup
      const { genre, ...rest } = DTO;

      prismaServiceMock.genre.findMany.mockResolvedValue([
        {
          id: 'genre1',
          name: 'Genre 1',
        },
        {
          id: 'genre2',
          name: 'Genre 2',
        },
      ]);

      const URL = 'url';
      cloudinaryServiceMock.uploadBookCover.mockResolvedValue({
        url: URL,
      });

      const BOOK_ID = 'bookId';
      jest.spyOn(uuid, 'uuid').mockReturnValue(BOOK_ID);

      // act
      await bookService.addBook(FILE_MOCK as Express.Multer.File, DTO);

      // assert
      expect(prismaServiceMock.genre.findMany).toBeCalledWith({
        where: {
          id: {
            in: DTO.genre,
          },
        },
      });
      expect(cloudinaryServiceMock.uploadBookCover).toBeCalledWith(
        FILE_MOCK,
        BOOK_ID,
      );
      expect(prismaServiceMock.book.create).toBeCalledWith({
        data: {
          id: BOOK_ID,
          coverUrl: URL,
          ...rest,
          genre: {
            connect: genre.map((id) => {
              return { id };
            }),
          },
        },
      });
    });

    it('should throw Bad Request Exception if genre id invalid', async () => {
      // setup
      prismaServiceMock.genre.findMany.mockResolvedValue([
        {
          id: 'genre2',
          name: 'Genre 2',
        },
      ]);

      // act and assert
      await expect(
        bookService.addBook(FILE_MOCK as Express.Multer.File, DTO),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('get all books', () => {
    const BOOK_1 = {
      id: 'book_1',
      title: 'Book 1',
      author: 'Author',
      rating: 4.3,
      genre: [
        {
          name: 'Drama',
        },
        {
          name: 'Fiction',
        },
      ],
      coverUrl: 'url',
    };

    const BOOK_2 = {
      id: 'book_2',
      title: 'Book 2',
      author: 'Author',
      rating: 4.3,
      genre: [
        {
          name: 'Drama',
        },
        {
          name: 'Fiction',
        },
      ],
      coverUrl: 'url',
    };

    it('should return all books', async () => {
      // setup
      prismaServiceMock.book.findMany.mockResolvedValue([BOOK_1, BOOK_2]);

      // act
      const result = await bookService.getAllBooks({});

      // assert
      expect(result).toEqual({ books: [BOOK_1, BOOK_2] });
    });
  });
});
