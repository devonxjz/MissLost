import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FoundPostsService } from './found-posts.service';
import { CreateFoundPostDto } from './dto/create-found-post.dto';
import { UpdateFoundPostDto } from './dto/update-found-post.dto';
import { QueryFoundPostsDto } from './dto/query-found-posts.dto';
import { ReviewPostDto } from '../lost-posts/dto/review-post.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Found Posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class FoundPostsController {
  constructor(private readonly foundPostsService: FoundPostsService) {}

  @Post('found-posts')
  @ApiOperation({ summary: 'Đăng bài nhặt được đồ' })
  create(@Body() dto: CreateFoundPostDto, @CurrentUser() user: any) {
    return this.foundPostsService.create(dto, user.id);
  }

  @Public()
  @Get('found-posts')
  @ApiOperation({ summary: 'Feed bài nhặt được (public)' })
  findAll(@Query() query: QueryFoundPostsDto) {
    return this.foundPostsService.findAll(query);
  }

  @Get('found-posts/my')
  @ApiOperation({ summary: 'Bài nhặt được của tôi' })
  findMy(@CurrentUser() user: any) {
    return this.foundPostsService.findMyPosts(user.id);
  }

  @Public()
  @Get('found-posts/:id')
  @ApiOperation({ summary: 'Chi tiết bài nhặt được' })
  findOne(@Param('id') id: string) {
    return this.foundPostsService.findOne(id);
  }

  @Patch('found-posts/:id')
  @ApiOperation({ summary: 'Cập nhật bài nhặt được' })
  update(@Param('id') id: string, @Body() dto: UpdateFoundPostDto, @CurrentUser() user: any) {
    return this.foundPostsService.update(id, dto, user.id, user.role);
  }

  @Delete('found-posts/:id')
  @ApiOperation({ summary: 'Xóa bài nhặt được' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.foundPostsService.remove(id, user.id, user.role);
  }

  @Get('admin/found-posts/pending')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Bài nhặt được chờ duyệt (admin)' })
  findPending() {
    return this.foundPostsService.findPending();
  }

  @Post('admin/found-posts/:id/review')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Duyệt bài nhặt được (admin)' })
  review(@Param('id') id: string, @Body() dto: ReviewPostDto, @CurrentUser() user: any) {
    return this.foundPostsService.adminReview(id, dto, user.id);
  }
}
