import { IsString, IsUUID, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStorageItemDto {
  @ApiProperty()
  @IsUUID()
  found_post_id: string;

  @ApiProperty()
  @IsUUID()
  storage_location_id: string;

  @ApiProperty({ example: 'UEH-2026-0001' })
  @IsString()
  item_code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  discard_after?: string;
}

export class ClaimStorageItemDto {
  @ApiProperty()
  @IsString()
  claim_notes: string;
}
