import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductImage } from '../entities/product-image.entity';
import { Shop } from '../entities/shop.entity';
import { User, UserRole } from '../entities/user.entity';
import { CreateProductDto, UpdateProductDto, AddProductImageDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const shop = await this.shopRepository.findOne({ where: { id: createProductDto.shop_id } });
    
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    if (shop.owner_id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only create products for your own shops');
    }

    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(filters?: {
    shop_id?: string;
    category_id?: string;
    city_id?: string;
    min_price?: number;
    max_price?: number;
    has_ar_model?: boolean;
    try_at_home_available?: boolean;
    tags?: string[];
  }) {
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.shop', 'shop')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('shop.city', 'city')
      .where('product.is_available = :isAvailable', { isAvailable: true });

    if (filters?.shop_id) {
      query.andWhere('product.shop_id = :shopId', { shopId: filters.shop_id });
    }

    if (filters?.category_id) {
      query.andWhere('product.category_id = :categoryId', { categoryId: filters.category_id });
    }

    if (filters?.city_id) {
      query.andWhere('shop.city_id = :cityId', { cityId: filters.city_id });
    }

    if (filters?.min_price) {
      query.andWhere('product.price_in_paise >= :minPrice', { minPrice: filters.min_price });
    }

    if (filters?.max_price) {
      query.andWhere('product.price_in_paise <= :maxPrice', { maxPrice: filters.max_price });
    }

    if (filters?.has_ar_model !== undefined) {
      query.andWhere('product.has_ar_model = :hasAr', { hasAr: filters.has_ar_model });
    }

    if (filters?.try_at_home_available !== undefined) {
      query.andWhere('product.try_at_home_available = :tryAtHome', { tryAtHome: filters.try_at_home_available });
    }

    if (filters?.tags && filters.tags.length > 0) {
      query.andWhere('product.tags && ARRAY[:...tags]', { tags: filters.tags });
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['shop', 'shop.city', 'category', 'images', 'reviews'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['shop'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.shop.owner_id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update products from your own shops');
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string, user: User) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['shop'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.shop.owner_id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete products from your own shops');
    }

    product.is_available = false;
    return this.productRepository.save(product);
  }

  async addImage(productId: string, addImageDto: AddProductImageDto, user: User) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['shop'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.shop.owner_id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only add images to products from your own shops');
    }

    const image = this.productImageRepository.create({
      product_id: productId,
      ...addImageDto,
    });

    return this.productImageRepository.save(image);
  }

  async searchByName(searchTerm: string) {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.shop', 'shop')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.is_available = :isAvailable', { isAvailable: true })
      .andWhere('LOWER(product.name) LIKE LOWER(:search)', { search: `%${searchTerm}%` })
      .orWhere('LOWER(product.description) LIKE LOWER(:search)', { search: `%${searchTerm}%` })
      .getMany();
  }
}
