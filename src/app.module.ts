import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DummyModule } from './dummy/dummy.module';

@Module({
  imports: [DummyModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
