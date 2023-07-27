import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { GenreModule } from './genre/genre.module';

@Module({
  controllers: [AppController],
  providers: [PrismaService],
  imports: [AuthModule, PrismaModule, GenreModule],
})
export class AppModule {}
