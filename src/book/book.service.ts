import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AddBookRequestDto } from './dto/AddBookRequest.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { uuid } from 'uuidv4';
import { GetAllBooksQueryDto } from './dto/GetAllBooksQuery.dto';
import { User } from '@prisma/client';

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

  async getAllBooks({
    keyword,
    ratingMin = 0,
    ratingMax = 5,
    genres = [],
    stock = 'available',
    page = 1,
    sortBy = 'title',
    orderBy = 'asc',
  }: GetAllBooksQueryDto) {
    type QueryMode = 'insensitive' | 'default';
    genres = genres.filter((genre) => genre !== '');

    const books = await this.prisma.book.findMany({
      where: {
        ...(keyword && {
          OR: [
            {
              title: {
                contains: keyword,
                mode: 'insensitive' as QueryMode,
              },
            },
            {
              author: {
                contains: keyword,
                mode: 'insensitive' as QueryMode,
              },
            },
          ],
        }),
        rating: {
          lte: ratingMax,
          gte: ratingMin,
        },
        ...(genres.length > 0 && {
          genre: {
            some: {
              id: {
                in: genres,
              },
            },
          },
        }),
        stock: {
          gte: stock === 'available' ? 1 : 0,
        },
      },
      select: {
        id: true,
        author: true,
        title: true,
        rating: true,
        coverUrl: true,
        genre: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        ...(sortBy === 'title' && { title: orderBy }),
        ...(sortBy === 'publishDate' && { publishDate: orderBy }),
        ...(sortBy === 'rating' && { rating: orderBy }),
      },
    });

    const BOOK_PER_PAGE = 10;
    page = Math.min(page, Math.max(1, Math.ceil(books.length / BOOK_PER_PAGE)));
    const paginated = books.slice(
      BOOK_PER_PAGE * (page - 1),
      BOOK_PER_PAGE * page,
    );

    return {
      books: paginated,
      pagination: {
        page,
        from: Math.min(BOOK_PER_PAGE * (page - 1) + 1, books.length),
        to: Math.min(BOOK_PER_PAGE * page, books.length),
        total: books.length,
        totalPage: Math.ceil(books.length / BOOK_PER_PAGE),
      },
    };
  }

  async getRecommendedBooks(username: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
      include: {
        favoriteGenre: true,
      },
    });

    const books = await this.prisma.book.findMany({
      where: {
        genre: {
          some: {
            id: {
              in: user.favoriteGenre.map((genre) => genre.id),
            },
          },
        },
      },
      select: {
        id: true,
        author: true,
        title: true,
        rating: true,
        coverUrl: true,
        genre: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
      take: 10,
    });

    return {
      books,
    };
  }

  async getBookById(bookId: string, user?: User) {
    const book = await this.prisma.book.findFirst({
      where: {
        id: bookId,
      },
      include: {
        genre: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!book) {
      throw new BadRequestException({ message: 'Invalid book id' });
    }

    let wishlisted = false;
    if (!!user) {
      const { wishlist } = await this.prisma.user.findFirst({
        where: {
          id: user.id,
        },
        select: {
          wishlist: {
            select: {
              id: true,
            },
          },
        },
      });

      wishlisted = wishlist.reduce((prev, current) => {
        return prev || current.id === bookId;
      }, false);
    }

    return {
      book,
      wishlisted,
    };
  }
}
