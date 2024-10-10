import { PartialType } from '@nestjs/mapped-types';
import { AddItemDto } from './add-item.dto';

export class UpdateItemDto extends PartialType(AddItemDto) {}
