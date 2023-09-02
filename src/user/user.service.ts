import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(username: string) {
    return await this.prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        username: true,
        name: true,
        fine: true,
      },
    });
  }

  async addBookToWishlist(reqUser: User, bookId: string) {
    const book = await this.prisma.book.findFirst({
      where: {
        id: bookId,
      },
    });

    if (!book) {
      throw new BadRequestException({ message: 'Invalid book id' });
    }

    const user = await this.prisma.user.findFirst({
      where: {
        username: reqUser.username,
      },
      include: {
        wishlist: true,
      },
    });

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        wishlist: {
          connect: {
            id: book.id,
          },
        },
      },
    });
  }

  async removeBookFromWishlist(reqUser: User, bookId: string) {
    const book = await this.prisma.book.findFirst({
      where: {
        id: bookId,
      },
    });

    if (!book) {
      throw new BadRequestException({ message: 'Invalid book id' });
    }

    const user = await this.prisma.user.findFirst({
      where: {
        username: reqUser.username,
      },
      include: {
        wishlist: true,
      },
    });

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        wishlist: {
          disconnect: {
            id: bookId,
          },
        },
      },
    });
  }

  async checkAvailable(username: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    return !user;
  }
}
