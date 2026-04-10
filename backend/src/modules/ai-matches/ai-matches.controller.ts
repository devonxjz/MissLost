import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AiMatchesService } from './ai-matches.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ConfirmMatchDto {
  @ApiProperty({ enum: ['owner', 'finder'] })
  @IsIn(['owner', 'finder'])
  side: 'owner' | 'finder';
}

@ApiTags('Matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class AiMatchesController {
  constructor(private readonly aiMatchesService: AiMatchesService) {}

  @Get('lost-posts/:id/matches')
  @ApiOperation({ summary: 'Xem danh sách matches của bài mất đồ' })
  findMatches(@Param('id') id: string) {
    return this.aiMatchesService.findMatches(id);
  }

  @Post('lost-posts/:id/run-match')
  @ApiOperation({ summary: 'Chạy text-matching cho bài mất đồ' })
  runMatch(@Param('id') id: string) {
    return this.aiMatchesService.runMatch(id);
  }

  @Patch('matches/:id/confirm')
  @ApiOperation({ summary: 'Xác nhận match (owner hoặc finder)' })
  confirm(@Param('id') id: string, @Body() dto: ConfirmMatchDto, @CurrentUser() user: any) {
    return this.aiMatchesService.confirmMatch(id, user.id, dto.side);
  }

  @Get('admin/dashboard')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Dashboard thống kê (admin)' })
  getDashboard() {
    return this.aiMatchesService.getDashboardStats();
  }
}
