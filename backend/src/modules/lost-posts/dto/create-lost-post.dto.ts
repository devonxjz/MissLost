import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsDateString,
  IsArray,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLostPostDto {
  @ApiProperty({ example: 'Mất ba lô đen tại thư viện' })
  @IsString()
  @MinLength(10)
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Ba lô đen Nike có máy tính bên trong...' })
  @IsString()
  @MinLength(20)
  description: string;

  @ApiProperty({ example: 'Thư viện tòa B, Cơ sở A UEH' })
  @IsString()
  location_lost: string;

  @ApiProperty({ example: '2026-04-10T14:00:00Z' })
  @IsDateString()
  time_lost: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  image_urls?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contact_info?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_urgent?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reward_note?: string;
}
