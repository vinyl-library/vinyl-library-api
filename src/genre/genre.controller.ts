import { Controller, Get, Param } from '@nestjs/common';
import { GenreService } from './genre.service';
import { IsPublic } from 'src/common/decorator/isPublic';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @IsPublic()
  @Get()
  async allGenre() {
    const data = await this.genreService.allGenre();

    return {
      message: 'Successfully get all genre',
      data,
    };
  }

  @Get('/:genreId')
  async getGenre(@Param('genreId') genreId: string) {
    const data = await this.genreService.getGenre(genreId);

    return {
      message: 'Successfully get genre detail',
      data,
    };
  }
}
