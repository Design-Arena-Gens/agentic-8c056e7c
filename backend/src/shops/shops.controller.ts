import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ShopsService } from './shops.service';
import { CreateShopDto, UpdateShopDto } from './dto/create-shop.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('Shops')
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SHOP_OWNER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new shop' })
  @ApiResponse({ status: 201, description: 'Shop successfully created' })
  create(@Body() createShopDto: CreateShopDto, @Request() req) {
    return this.shopsService.create(createShopDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shops with optional filters' })
  @ApiQuery({ name: 'city_id', required: false })
  @ApiQuery({ name: 'taluka_id', required: false })
  @ApiQuery({ name: 'state_id', required: false })
  @ApiQuery({ name: 'membership_status', required: false })
  @ApiQuery({ name: 'verified', required: false, type: Boolean })
  findAll(@Query() query: any) {
    return this.shopsService.findAll(query);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find shops nearby a location' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in kilometers (default: 10)' })
  findNearby(@Query('lat') lat: number, @Query('lng') lng: number, @Query('radius') radius?: number) {
    return this.shopsService.searchNearby(lat, lng, radius);
  }

  @Get('my-shops')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get shops owned by current user' })
  findMyShops(@Request() req) {
    return this.shopsService.findByOwner(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shop by ID' })
  findOne(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update shop' })
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto, @Request() req) {
    return this.shopsService.update(id, updateShopDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete shop (soft delete)' })
  remove(@Param('id') id: string, @Request() req) {
    return this.shopsService.remove(id, req.user);
  }
}
