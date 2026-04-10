import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HandoversService } from './handovers.service';
import { CreateHandoverDto, ConfirmHandoverDto } from './dto/handover.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Handovers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('handovers')
export class HandoversController {
  constructor(private readonly handoversService: HandoversService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo yêu cầu trao trả' })
  create(@Body() dto: CreateHandoverDto, @CurrentUser() user: any) {
    return this.handoversService.create(dto, user.id);
  }

  @Get('my')
  @ApiOperation({ summary: 'Danh sách trao trả của tôi' })
  getMyHandovers(@CurrentUser() user: any) {
    return this.handoversService.getMyHandovers(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết trao trả' })
  findOne(@Param('id') id: string) {
    return this.handoversService.findOne(id);
  }

  @Post(':id/confirm-owner')
  @ApiOperation({ summary: 'Xác nhận trao trả (chủ đồ)' })
  confirmOwner(@Param('id') id: string, @Body() dto: ConfirmHandoverDto, @CurrentUser() user: any) {
    return this.handoversService.confirmByOwner(id, dto, user.id);
  }

  @Post(':id/confirm-finder')
  @ApiOperation({ summary: 'Xác nhận trao trả (người nhặt)' })
  confirmFinder(@Param('id') id: string, @Body() dto: ConfirmHandoverDto, @CurrentUser() user: any) {
    return this.handoversService.confirmByFinder(id, dto, user.id);
  }
}
