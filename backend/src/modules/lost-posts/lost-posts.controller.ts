import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LostPostsService } from './lost-posts.service';
import { CreateLostPostDto } from './dto/create-lost-post.dto';
import { UpdateLostPostDto } from './dto/update-lost-post.dto';
import { QueryLostPostsDto } from './dto/query-lost-posts.dto';
import { ReviewPostDto } from './dto/review-post.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Lost Posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class LostPostsController {
  constructor(private readonly lostPostsService: LostPostsService) {}

  @Post('lost-posts')
  @ApiOperation({ summary: 'Đăng bài mất đồ' })
  create(@Body() dto: CreateLostPostDto, @CurrentUser() user: any) {
    return this.lostPostsService.create(dto, user.id);
  }

  @Public()
  @Get('lost-posts')
  @ApiOperation({ summary: 'Feed bài mất đồ (public)' })
  findAll(@Query() query: QueryLostPostsDto) {
    return this.lostPostsService.findAll(query);
  }

  @Get('lost-posts/my')
  @ApiOperation({ summary: 'Bài mất đồ của tôi' })
  findMy(@CurrentUser() user: any) {
    return this.lostPostsService.findMyPosts(user.id);
  }

  @Public()
  @Get('lost-posts/:id')
  @ApiOperation({ summary: 'Chi tiết bài mất đồ' })
  findOne(@Param('id') id: string) {
    return this.lostPostsService.findOne(id);
  }

  @Patch('lost-posts/:id')
  @ApiOperation({ summary: 'Cập nhật bài mất đồ' })
  update(@Param('id') id: string, @Body() dto: UpdateLostPostDto, @CurrentUser() user: any) {
    return this.lostPostsService.update(id, dto, user.id, user.role);
  }

  @Delete('lost-posts/:id')
  @ApiOperation({ summary: 'Xóa bài mất đồ' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.lostPostsService.remove(id, user.id, user.role);
  }

  @Get('admin/lost-posts/pending')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Danh sách bài mất đồ chờ duyệt (admin)' })
  findPending() {
    return this.lostPostsService.findPending();
  }

  @Post('admin/lost-posts/:id/review')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Duyệt bài mất đồ (admin)' })
  review(@Param('id') id: string, @Body() dto: ReviewPostDto, @CurrentUser() user: any) {
    return this.lostPostsService.adminReview(id, dto, user.id);
  }
}
