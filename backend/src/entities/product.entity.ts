import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Shop } from './shop.entity';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { OrderItem } from './order-item.entity';
import { Review } from './review.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Shop, (shop) => shop.products)
  shop: Shop;

  @Column()
  shop_id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  sku: string;

  @Column('text')
  description: string;

  @Column('bigint')
  price_in_paise: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Column()
  category_id: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  weight_grams: number;

  @Column({ nullable: true })
  purity: string;

  @Column('int', { default: 0 })
  stock_quantity: number;

  @Column({ default: true })
  is_available: boolean;

  @Column({ default: false })
  has_ar_model: boolean;

  @Column({ nullable: true })
  ar_model_url: string;

  @Column({ default: false })
  try_at_home_available: boolean;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  order_items: OrderItem[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
}
