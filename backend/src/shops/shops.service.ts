import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from '../entities/shop.entity';
import { User, UserRole } from '../entities/user.entity';
import { CreateShopDto, UpdateShopDto } from './dto/create-shop.dto';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createShopDto: CreateShopDto, userId: string) {
    const shop = this.shopRepository.create({
      ...createShopDto,
      owner_id: userId,
    });

    return this.shopRepository.save(shop);
  }

  async findAll(filters?: {
    city_id?: string;
    taluka_id?: string;
    state_id?: string;
    membership_status?: string;
    verified?: boolean;
  }) {
    const query = this.shopRepository.createQueryBuilder('shop')
      .leftJoinAndSelect('shop.city', 'city')
      .leftJoinAndSelect('city.state', 'state')
      .leftJoinAndSelect('shop.taluka', 'taluka')
      .leftJoinAndSelect('shop.owner', 'owner')
      .where('shop.is_active = :isActive', { isActive: true });

    if (filters?.city_id) {
      query.andWhere('shop.city_id = :cityId', { cityId: filters.city_id });
    }

    if (filters?.taluka_id) {
      query.andWhere('shop.taluka_id = :talukaId', { talukaId: filters.taluka_id });
    }

    if (filters?.state_id) {
      query.andWhere('city.state_id = :stateId', { stateId: filters.state_id });
    }

    if (filters?.membership_status) {
      query.andWhere('shop.membership_status = :status', { status: filters.membership_status });
    }

    if (filters?.verified !== undefined) {
      query.andWhere('shop.verified = :verified', { verified: filters.verified });
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const shop = await this.shopRepository.findOne({
      where: { id },
      relations: ['city', 'city.state', 'taluka', 'owner', 'products'],
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return shop;
  }

  async findByOwner(userId: string) {
    return this.shopRepository.find({
      where: { owner_id: userId },
      relations: ['city', 'taluka'],
    });
  }

  async update(id: string, updateShopDto: UpdateShopDto, user: User) {
    const shop = await this.findOne(id);

    if (shop.owner_id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own shops');
    }

    Object.assign(shop, updateShopDto);
    return this.shopRepository.save(shop);
  }

  async remove(id: string, user: User) {
    const shop = await this.findOne(id);

    if (shop.owner_id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own shops');
    }

    shop.is_active = false;
    return this.shopRepository.save(shop);
  }

  async searchNearby(lat: number, lng: number, radiusKm: number = 10) {
    const shops = await this.shopRepository
      .createQueryBuilder('shop')
      .leftJoinAndSelect('shop.city', 'city')
      .leftJoinAndSelect('shop.owner', 'owner')
      .where('shop.is_active = :isActive', { isActive: true })
      .andWhere(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(shop.lat)) * cos(radians(shop.lng) - radians(:lng)) + sin(radians(:lat)) * sin(radians(shop.lat)))) <= :radius`,
        { lat, lng, radius: radiusKm }
      )
      .getMany();

    return shops;
  }
}
