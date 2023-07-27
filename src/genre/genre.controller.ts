import { Controller, Get } from '@nestjs/common';
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
}
