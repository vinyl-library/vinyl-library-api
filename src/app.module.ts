import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { GenreModule } from './genre/genre.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { BookModule } from './book/book.module';

@Module({
  controllers: [AppController],
  providers: [PrismaService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    GenreModule,
    UserModule,
    CloudinaryModule,
    BookModule,
  ],
})
export class AppModule {}
