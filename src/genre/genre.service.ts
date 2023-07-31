import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GenreService {
  constructor(private prisma: PrismaService) {}

  async allGenre() {
    const genre = await this.prisma.genre.findMany();

    return { genre };
  }

  async getGenre(genreId: string) {
    const genre = await this.prisma.genre.findFirst({
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

    if (!genre) {
      throw new BadRequestException('Invalid genre id');
    }

    return {
      id: genre.id,
      name: genre.name,
      bookCount: genre._count.books,
    };
  }
}
