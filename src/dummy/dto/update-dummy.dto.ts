import { PartialType } from '@nestjs/mapped-types';
import { CreateDummyDto } from './create-dummy.dto';

export class UpdateDummyDto extends PartialType(CreateDummyDto) {}
