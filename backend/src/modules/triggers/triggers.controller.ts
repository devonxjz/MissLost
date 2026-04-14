import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TriggersService } from './triggers.service';
import { CreateTriggerDto } from './dto/trigger.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Triggers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('triggers')
export class TriggersController {
  constructor(private readonly triggersService: TriggersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo trigger xác nhận trao trả (Finder)' })
  create(@Body() dto: CreateTriggerDto, @CurrentUser() user: any) {
    return this.triggersService.create(dto, user.id);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Xác nhận nhận đồ (User target)' })
  confirm(@Param('id') id: string, @CurrentUser() user: any) {
    return this.triggersService.confirm(id, user.id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Hủy trigger (Finder)' })
  cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.triggersService.cancel(id, user.id);
  }

  @Get('conversation/:conversationId')
  @ApiOperation({ summary: 'Lấy trigger theo cuộc hội thoại' })
  getByConversation(
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: any,
  ) {
    return this.triggersService.getByConversation(conversationId, user.id);
  }
}
