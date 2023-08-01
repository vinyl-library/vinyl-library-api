import { IsNotEmpty, IsString } from 'class-validator';

export class AddGenreRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
