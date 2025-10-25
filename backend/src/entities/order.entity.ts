import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum OrderType {
  ONLINE_PURCHASE = 'online_purchase',
  TRY_AT_HOME = 'try_at_home',
  STORE_VISIT = 'store_visit',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  order_number: string;

  @ManyToOne(() => User, (user) => user.orders)
  customer: User;

  @Column()
  customer_id: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: OrderType,
    default: OrderType.ONLINE_PURCHASE,
  })
  order_type: OrderType;

  @Column('bigint')
  total_amount_paise: number;

  @Column('text', { nullable: true })
  delivery_address: string;

  @Column({ nullable: true })
  delivery_city: string;

  @Column({ nullable: true })
  delivery_state: string;

  @Column({ nullable: true })
  delivery_pincode: string;

  @Column({ nullable: true })
  delivery_phone: string;

  @Column({ nullable: true })
  scheduled_date: Date;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];
}
