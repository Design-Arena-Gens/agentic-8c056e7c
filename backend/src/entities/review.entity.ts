import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Shop } from './shop.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @Column()
  user_id: string;

  @ManyToOne(() => Product, (product) => product.reviews, { nullable: true })
  product: Product;

  @Column({ nullable: true })
  product_id: string;

  @ManyToOne(() => Shop, (shop) => shop.reviews, { nullable: true })
  shop: Shop;

  @Column({ nullable: true })
  shop_id: string;

  @Column('int')
  rating: number;

  @Column('text', { nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Date;
}
