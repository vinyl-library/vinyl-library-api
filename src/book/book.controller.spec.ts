import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { AddBookRequestDto } from './dto/AddBookRequest.dto';
import { GetAllBooksQueryDto } from './dto/GetAllBooksQuery.dto';

describe('BookController', () => {
  let bookController: BookController;
  const bookServiceMock = {
    addBook: jest.fn(),
    getAllBooks: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: bookServiceMock,
        },
      ],
    }).compile();

    bookController = module.get<BookController>(BookController);
  });

  describe('add book', () => {
    it('should return success message', async () => {
      // setup
      const DTO: AddBookRequestDto = {
        title: 'Title',
        author: 'Author',
        publisher: 'Publisher',
        publishDate: new Date(),
        description: 'Description',
        genre: ['genre1'],
        pages: 123,
        stock: 3,
      };

      const FILE_MOCK: Partial<Express.Multer.File> = {};

      const SUCCESS_MESSAGE = {
        message: 'Successfully added a book',
      };

      // act
      const result = await bookController.addBook(
        FILE_MOCK as Express.Multer.File,
        DTO,
      );

      // assert
      expect(result).toEqual(SUCCESS_MESSAGE);
      expect(bookServiceMock.addBook).toBeCalledWith(FILE_MOCK, DTO);
    });
  });

  describe('get all books', () => {
    const BOOKS = {
      books: [
        {
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
        },
        {
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
        },
      ],
    };

    it('should return all books', async () => {
      // setup
      bookServiceMock.getAllBooks.mockResolvedValue(BOOKS);
      const SUCCESS_MESSAGE = {
        message: 'Successfully get all books',
      };

      // act
      const result = await bookController.getAllBooks(
        {} as GetAllBooksQueryDto,
      );

      // assert
      expect(result).toEqual({ ...SUCCESS_MESSAGE, data: BOOKS });
      expect(bookServiceMock.getAllBooks).toBeCalled();
    });
  });
});
