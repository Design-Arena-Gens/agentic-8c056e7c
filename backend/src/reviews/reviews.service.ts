import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Product } from '../entities/product.entity';
import { Shop } from '../entities/shop.entity';
import { User } from '../entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
  ) {}

  async create(createReviewDto: CreateReviewDto, user: User) {
    if (!createReviewDto.product_id && !createReviewDto.shop_id) {
      throw new BadRequestException('Review must be for either a product or a shop');
    }

    if (createReviewDto.product_id) {
      const product = await this.productRepository.findOne({
        where: { id: createReviewDto.product_id },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
    }

    if (createReviewDto.shop_id) {
      const shop = await this.shopRepository.findOne({
        where: { id: createReviewDto.shop_id },
      });
      if (!shop) {
        throw new NotFoundException('Shop not found');
      }
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      user_id: user.id,
    });

    return this.reviewRepository.save(review);
  }

  async findByProduct(productId: string) {
    return this.reviewRepository.find({
      where: { product_id: productId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findByShop(shopId: string) {
    return this.reviewRepository.find({
      where: { shop_id: shopId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findByUser(userId: string) {
    return this.reviewRepository.find({
      where: { user_id: userId },
      relations: ['product', 'shop'],
      order: { created_at: 'DESC' },
    });
  }

  async getAverageRating(productId?: string, shopId?: string) {
    const query = this.reviewRepository.createQueryBuilder('review');

    if (productId) {
      query.where('review.product_id = :productId', { productId });
    } else if (shopId) {
      query.where('review.shop_id = :shopId', { shopId });
    }

    const result = await query
      .select('AVG(review.rating)', 'average')
      .addSelect('COUNT(review.id)', 'count')
      .getRawOne();

    return {
      average: parseFloat(result.average) || 0,
      count: parseInt(result.count) || 0,
    };
  }
}
