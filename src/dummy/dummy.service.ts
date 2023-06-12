import { Injectable } from '@nestjs/common';
import { CreateDummyDto } from './dto/create-dummy.dto';
import { UpdateDummyDto } from './dto/update-dummy.dto';

@Injectable()
export class DummyService {
  create(createDummyDto: CreateDummyDto) {
    return 'This action adds a new dummy';
  }

  findAll() {
    return `This action returns all dummy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dummy`;
  }

  update(id: number, updateDummyDto: UpdateDummyDto) {
    return `This action updates a #${id} dummy`;
  }

  remove(id: number) {
    return `This action removes a #${id} dummy`;
  }
}
