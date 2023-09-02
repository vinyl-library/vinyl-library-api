import { IsNotEmpty, IsString } from 'class-validator';

export class AddBookToWishlistDto {
  @IsString()
  @IsNotEmpty()
  bookId: string;
}
