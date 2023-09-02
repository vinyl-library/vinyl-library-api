import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IsPublic } from 'src/common/decorator/isPublic';
import { Request } from 'express';
import { AddBookToWishlistDto } from './dto/AddBookToWishlist.dto';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Req() request: Request) {
    const requestUser = request.user as User;

    const user = await this.userService.getUser(requestUser.username);

    return {
      message: 'Successfully get user',
      data: user,
    };
  }

  @IsPublic()
  @Get('/check/:username')
  async checkAvailable(@Param('username') username: string) {
    const status = await this.userService.checkAvailable(username);

    return {
      message: status ? 'Username available' : 'Username unavailable',
      data: {
        status,
      },
    };
  }

  @Post('/wishlist')
  async addBookToWishlist(
    @Req() request: Request,
    @Body() addBookToWishlist: AddBookToWishlistDto,
  ) {
    const requestUser = request.user as User;

    await this.userService.addBookToWishlist(
      requestUser,
      addBookToWishlist.bookId,
    );

    return {
      messsage: 'Successfully add book to wishlist',
    };
  }

  @Delete('/wishlist/:bookId')
  async deleteBookFromWishlist(
    @Req() request: Request,
    @Param('bookId') bookId: string,
  ) {
    const requestUser = request.user as User;

    await this.userService.removeBookFromWishlist(requestUser, bookId);

    return {
      message: 'Successfully remove book from wishlist',
    };
  }
}
