import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class AddBookRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  publisher: string;

  @IsDate()
  @IsNotEmpty()
  publishDate: Date;

  @IsArray()
  @IsString({ each: true })
  genre: string[];

  @IsNumber()
  @IsNotEmpty()
  pages: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
