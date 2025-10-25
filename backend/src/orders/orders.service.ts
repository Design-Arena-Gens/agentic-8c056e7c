import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    if (createOrderDto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of createOrderDto.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.product_id },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.product_id} not found`);
      }

      if (!product.is_available) {
        throw new BadRequestException(`Product ${product.name} is not available`);
      }

      if (product.stock_quantity < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.name}`);
      }

      const itemTotal = product.price_in_paise * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product_id: product.id,
        quantity: item.quantity,
        price_per_unit_paise: product.price_in_paise,
        total_price_paise: itemTotal,
      });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = this.orderRepository.create({
      order_number: orderNumber,
      customer_id: user.id,
      order_type: createOrderDto.order_type,
      total_amount_paise: totalAmount,
      delivery_address: createOrderDto.delivery_address,
      delivery_city: createOrderDto.delivery_city,
      delivery_state: createOrderDto.delivery_state,
      delivery_pincode: createOrderDto.delivery_pincode,
      delivery_phone: createOrderDto.delivery_phone,
      scheduled_date: createOrderDto.scheduled_date ? new Date(createOrderDto.scheduled_date) : null,
      notes: createOrderDto.notes,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    for (const item of orderItems) {
      const orderItem = this.orderItemRepository.create({
        ...item,
        order_id: savedOrder.id,
      });
      await this.orderItemRepository.save(orderItem);

      const product = await this.productRepository.findOne({
        where: { id: item.product_id },
      });
      product.stock_quantity -= item.quantity;
      await this.productRepository.save(product);
    }

    return this.findOne(savedOrder.id);
  }

  async findAll(userId?: string, status?: OrderStatus) {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('product.shop', 'shop');

    if (userId) {
      query.where('order.customer_id = :userId', { userId });
    }

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    query.orderBy('order.created_at', 'DESC');

    return query.getMany();
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.product', 'items.product.shop', 'items.product.images'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async getOrdersByShop(shopId: string) {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('product.shop', 'shop')
      .where('shop.id = :shopId', { shopId })
      .orderBy('order.created_at', 'DESC')
      .getMany();
  }
}
