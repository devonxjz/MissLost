import { PartialType } from '@nestjs/swagger';
import { CreateFoundPostDto } from './create-found-post.dto';

export class UpdateFoundPostDto extends PartialType(CreateFoundPostDto) {}
