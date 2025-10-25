import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @Column()
  order_id: string;

  @ManyToOne(() => Product, (product) => product.order_items)
  product: Product;

  @Column()
  product_id: string;

  @Column('int')
  quantity: number;

  @Column('bigint')
  price_per_unit_paise: number;

  @Column('bigint')
  total_price_paise: number;
}
