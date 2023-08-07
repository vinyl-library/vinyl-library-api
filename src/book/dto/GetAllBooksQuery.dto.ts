import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetAllBooksQueryDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumber()
  ratingMin?: number;

  @IsOptional()
  @IsNumber()
  ratingMax?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  genres?: string[];

  @IsOptional()
  @IsString()
  stock?: string;
}
