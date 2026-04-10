import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateConversationDto, SendMessageDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Danh sách cuộc hội thoại của tôi' })
  getConversations(@CurrentUser() user: any) {
    return this.chatService.getMyConversations(user.id);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Tạo hoặc lấy cuộc hội thoại' })
  createConversation(@Body() dto: CreateConversationDto, @CurrentUser() user: any) {
    return this.chatService.createOrGetConversation(dto, user.id);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Lấy tin nhắn trong cuộc hội thoại' })
  getMessages(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.chatService.getMessages(id, user.id, +page, +limit);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Gửi tin nhắn' })
  sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto, @CurrentUser() user: any) {
    return this.chatService.sendMessage(id, dto, user.id);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Số tin nhắn chưa đọc' })
  getUnreadCount(@CurrentUser() user: any) {
    return this.chatService.getUnreadCount(user.id);
  }
}
