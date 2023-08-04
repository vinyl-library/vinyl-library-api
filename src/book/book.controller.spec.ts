import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { FILE } from 'dns';
import { AddBookRequestDto } from './dto/AddBookRequest.dto';

describe('BookController', () => {
  let bookController: BookController;
  const bookServiceMock = {
    addBook: jest.fn(),
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

      expect(result).toEqual(SUCCESS_MESSAGE);
      expect(bookServiceMock.addBook).toBeCalledWith(FILE_MOCK, DTO);
    });
  });
});
