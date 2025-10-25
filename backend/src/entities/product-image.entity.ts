import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.images)
  product: Product;

  @Column()
  product_id: string;

  @Column()
  image_url: string;

  @Column({ default: 0 })
  display_order: number;

  @Column({ default: false })
  is_primary: boolean;
}
