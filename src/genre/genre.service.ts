import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GenreService {
  constructor(private prisma: PrismaService) {}

  async allGenre() {
    const genre = await this.prisma.genre.findMany();

    return { genre };
  }
}
