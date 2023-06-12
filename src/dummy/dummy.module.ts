import { Module } from '@nestjs/common';
import { DummyService } from './dummy.service';
import { DummyController } from './dummy.controller';

@Module({
  controllers: [DummyController],
  providers: [DummyService]
})
export class DummyModule {}
