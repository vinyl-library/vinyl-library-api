import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AddBookRequestDto } from './dto/AddBookRequest.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { uuid } from 'uuidv4';

@Injectable()
export class BookService {
  constructor(
    private cloudinary: CloudinaryService,
    private prisma: PrismaService,
  ) {}

  async addBook(
    coverFile: Express.Multer.File,
    { genre, ...rest }: AddBookRequestDto,
  ) {
    const genres = await this.prisma.genre.findMany({
      where: {
        id: {
          in: genre,
        },
      },
    });

    if (genres.length !== genre.length) {
      throw new BadRequestException({ message: 'Some genre ids are invalid' });
    }

    const bookId = uuid();

    const uploadRes = coverFile
      ? await this.cloudinary.uploadBookCover(coverFile, bookId)
      : '';

    await this.prisma.book.create({
      data: {
        id: bookId,
        coverUrl: uploadRes ? uploadRes.url : '',
        ...rest,
        genre: {
          connect: genre.map((id) => {
            return { id };
          }),
        },
      },
    });
  }

  async getAllBooks() {
    const books = await this.prisma.book.findMany({
      select: {
        id: true,
        author: true,
        title: true,
        rating: true,
        coverUrl: true,
        genre: {
          select: {
            name: true
          }
        }
      }
    });

    return { books };
  }
}
