import { PartialType } from '@nestjs/swagger';
import { CreateLostPostDto } from './create-lost-post.dto';

export class UpdateLostPostDto extends PartialType(CreateLostPostDto) {}
