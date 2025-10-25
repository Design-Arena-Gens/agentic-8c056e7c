import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';

export enum MetalType {
  GOLD = 'gold',
  SILVER = 'silver',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({
    type: 'enum',
    enum: MetalType,
  })
  metal_type: MetalType;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
