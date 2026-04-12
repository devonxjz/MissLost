import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  @Get('users/me')
  @ApiOperation({ summary: 'Lấy thông tin cá nhân' })
  getMe(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Patch('users/me')
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân' })
  async updateMe(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    const updatedUser = await this.usersService.updateProfile(user.id, dto);
    const payload = { sub: updatedUser.id, email: updatedUser.email, role: updatedUser.role };
    const access_token = this.jwtService.sign(payload);
    return { user: updatedUser, access_token };
  }

  @Get('users/me/posts')
  @ApiOperation({ summary: 'Lấy tất cả bài đăng của tôi' })
  getMyPosts(@CurrentUser() user: any) {
    return this.usersService.getUserPosts(user.id);
  }

  @Get('users/me/training-history')
  @ApiOperation({ summary: 'Lịch sử điểm rèn luyện' })
  getTrainingHistory(@CurrentUser() user: any) {
    return this.usersService.getTrainingHistory(user.id);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Xem thông tin user (admin)' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('admin/users')
  @ApiOperation({ summary: 'Danh sách tất cả users (admin)' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.usersService.findAll(+page, +limit);
  }

  @Patch('admin/users/:id/suspend')
  @ApiOperation({ summary: 'Khóa tài khoản user (admin)' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  suspend(@Param('id') id: string) {
    return this.usersService.updateStatus(id, 'suspended');
  }

  @Patch('admin/users/:id/activate')
  @ApiOperation({ summary: 'Mở khóa tài khoản user (admin)' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  activate(@Param('id') id: string) {
    return this.usersService.updateStatus(id, 'active');
  }
}
