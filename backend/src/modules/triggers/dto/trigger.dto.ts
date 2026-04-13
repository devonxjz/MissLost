import { IsUUID, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTriggerDto {
  @ApiProperty({ description: 'ID bài đăng (found_post hoặc lost_post)' })
  @IsUUID()
  post_id: string;

  @ApiProperty({ enum: ['found', 'lost'], description: 'Loại bài đăng' })
  @IsIn(['found', 'lost'])
  post_type: 'found' | 'lost';

  @ApiProperty({ description: 'ID user người nhận (sẽ bấm xác nhận)' })
  @IsUUID()
  target_user_id: string;

  @ApiPropertyOptional({ description: 'ID cuộc hội thoại liên quan' })
  @IsOptional()
  @IsUUID()
  conversation_id?: string;
}
