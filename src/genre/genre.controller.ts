import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GenreService } from './genre.service';
import { IsPublic } from 'src/common/decorator/isPublic';
import { AddGenreRequestDto } from './dto/AddGenreRequest.dto';

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

  @Post()
  async addGenre(@Body() addGenreRequestDto: AddGenreRequestDto) {
    await this.genreService.addGenre(addGenreRequestDto);

    return {
      message: 'Successfully added new genre',
    };
  }
}
