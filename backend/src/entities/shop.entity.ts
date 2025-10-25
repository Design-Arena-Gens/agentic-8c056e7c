import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { City, Taluka } from './location.entity';
import { Product } from './product.entity';
import { Review } from './review.entity';

export enum MembershipStatus {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

@Entity('shops')
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.shops)
  owner: User;

  @Column()
  owner_id: string;

  @Column()
  name: string;

  @ManyToOne(() => City, (city) => city.shops)
  city: City;

  @Column()
  city_id: string;

  @ManyToOne(() => Taluka, (taluka) => taluka.shops, { nullable: true })
  taluka: Taluka;

  @Column({ nullable: true })
  taluka_id: string;

  @Column('text')
  address: string;

  @Column()
  phone: string;

  @Column()
  whatsapp: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.FREE,
  })
  membership_status: MembershipStatus;

  @Column({ nullable: true })
  membership_started_at: Date;

  @Column({ nullable: true })
  membership_expires_at: Date;

  @Column({ default: false })
  verified: boolean;

  @Column('decimal', { precision: 10, scale: 7 })
  lat: number;

  @Column('decimal', { precision: 10, scale: 7 })
  lng: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Product, (product) => product.shop)
  products: Product[];

  @OneToMany(() => Review, (review) => review.shop)
  reviews: Review[];
}
