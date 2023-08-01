import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddGenreRequestDto } from './dto/AddGenreRequest.dto';

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

  async addGenre({ name }: AddGenreRequestDto) {
    await this.prisma.genre.create({
      data: {
        name,
      },
    });
  }

  async deleteGenre(genreId: string) {
    const genre = await this.prisma.genre.findFirst({
      where: {
        id: genreId,
      },
    });

    if (!genre) {
      throw new BadRequestException({ message: 'Invalid genre id' });
    }

    await this.prisma.genre.delete({
      where: {
        id: genreId,
      },
    });
  }
}
