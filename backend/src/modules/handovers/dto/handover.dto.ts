import { IsUUID, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHandoverDto {
  @ApiProperty()
  @IsUUID()
  lost_post_id: string;

  @ApiProperty()
  @IsUUID()
  found_post_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  conversation_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  handover_location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  handover_note?: string;
}

export class ConfirmHandoverDto {
  @ApiProperty({ description: 'Mã xác thực 6 chữ số' })
  @IsString()
  verification_code: string;
}
