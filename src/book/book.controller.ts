import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddBookRequestDto } from './dto/AddBookRequest.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseInterceptors(FileInterceptor('cover'))
  async addBook(
    @UploadedFile() coverFile: Express.Multer.File,
    @Body() addBookRequestDto: AddBookRequestDto,
  ) {
    await this.bookService.addBook(coverFile, addBookRequestDto);

    return {
      message: 'Successfully added a book',
    };
  }
}
