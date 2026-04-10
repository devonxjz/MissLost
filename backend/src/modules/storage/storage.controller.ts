import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { CreateStorageItemDto, ClaimStorageItemDto } from './dto/storage.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Storage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Public()
  @Get('locations')
  @ApiOperation({ summary: 'Danh sách địa điểm kho' })
  getLocations() {
    return this.storageService.getLocations();
  }

  @Public()
  @Get('items')
  @ApiOperation({ summary: 'Danh sách đồ trong kho' })
  getItems(@Query('location_id') locationId?: string) {
    return this.storageService.getItems(locationId);
  }

  @Public()
  @Get('items/search')
  @ApiOperation({ summary: 'Tìm đồ theo mã vật phẩm' })
  search(@Query('code') code: string) {
    return this.storageService.searchByCode(code);
  }

  @Public()
  @Get('items/:id')
  @ApiOperation({ summary: 'Chi tiết vật phẩm kho' })
  getItem(@Param('id') id: string) {
    return this.storageService.getItem(id);
  }

  @Post('items')
  @UseGuards(RolesGuard)
  @Roles('admin', 'storage_staff')
  @ApiOperation({ summary: 'Nhập vật phẩm vào kho (staff/admin)' })
  createItem(@Body() dto: CreateStorageItemDto, @CurrentUser() user: any) {
    return this.storageService.createItem(dto, user.id);
  }

  @Patch('items/:id/claim')
  @ApiOperation({ summary: 'Xác nhận nhận lại đồ từ kho' })
  claimItem(@Param('id') id: string, @Body() dto: ClaimStorageItemDto, @CurrentUser() user: any) {
    return this.storageService.claimItem(id, dto, user.id);
  }
}
