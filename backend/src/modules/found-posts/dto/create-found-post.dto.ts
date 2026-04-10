import {
  IsString, IsOptional, IsBoolean, IsUUID,
  IsDateString, IsArray, IsUrl, MaxLength, MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFoundPostDto {
  @ApiProperty({ example: 'Nhặt được ví tại sân B' })
  @IsString()
  @MinLength(10)
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Ví màu nâu, có thẻ sinh viên bên trong...' })
  @IsString()
  @MinLength(20)
  description: string;

  @ApiProperty({ example: 'Sân phía sau tòa B, Cơ sở A UEH' })
  @IsString()
  location_found: string;

  @ApiProperty({ example: '2026-04-10T14:00:00Z' })
  @IsDateString()
  time_found: string;

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

  @ApiPropertyOptional({ description: 'Đã nộp vào kho?' })
  @IsOptional()
  @IsBoolean()
  is_in_storage?: boolean;
}
