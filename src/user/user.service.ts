import { Injectable } from '@nestjs/common';
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

  async checkAvailable(username: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    return !user;
  }
}
