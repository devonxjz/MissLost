import { IsString, IsOptional, IsUUID, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  lost_post_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  found_post_id?: string;

  @ApiProperty({ description: 'ID người nhận tin nhắn đầu tiên' })
  @IsUUID()
  recipient_id: string;
}

export class SendMessageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiPropertyOptional({ enum: ['text', 'image', 'system', 'handover_request'], default: 'text' })
  @IsOptional()
  @IsIn(['text', 'image', 'system', 'handover_request'])
  message_type?: string;
}
