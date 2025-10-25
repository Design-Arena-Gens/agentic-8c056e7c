import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review successfully created' })
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewsService.create(createReviewDto, req.user);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get all reviews for a product' })
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  @Get('shop/:shopId')
  @ApiOperation({ summary: 'Get all reviews for a shop' })
  findByShop(@Param('shopId') shopId: string) {
    return this.reviewsService.findByShop(shopId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all reviews by a user' })
  findByUser(@Param('userId') userId: string) {
    return this.reviewsService.findByUser(userId);
  }

  @Get('average')
  @ApiOperation({ summary: 'Get average rating for a product or shop' })
  @ApiQuery({ name: 'product_id', required: false })
  @ApiQuery({ name: 'shop_id', required: false })
  getAverageRating(@Query('product_id') productId?: string, @Query('shop_id') shopId?: string) {
    return this.reviewsService.getAverageRating(productId, shopId);
  }
}
