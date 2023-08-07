import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddBookRequestDto } from './dto/AddBookRequest.dto';
import { IsPublic } from 'src/common/decorator/isPublic';
import { Request } from 'express';
import { User } from '@prisma/client';
import { GetAllBooksQueryDto } from './dto/GetAllBooksQuery.dto';

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

  @IsPublic()
  @Get()
  async getAllBooks(@Query() query: GetAllBooksQueryDto) {
    const data = await this.bookService.getAllBooks(query);

    return { message: 'Successfully get all books', data };
  }

  @Get('/recommended')
  async getRecommendedBooks(@Req() request: Request) {
    const user = request.user as User;

    const data = await this.bookService.getRecommendedBooks(user.username);

    return { message: 'Successfully get recommended books', data };
  }
}
