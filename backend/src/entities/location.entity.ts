import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('states')
export class State {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  code: string;

  @OneToMany(() => City, (city) => city.state)
  cities: City[];
}

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => State, (state) => state.cities)
  state: State;

  @Column()
  state_id: string;

  @OneToMany(() => District, (district) => district.city)
  districts: District[];

  @OneToMany(() => Shop, (shop) => shop.city)
  shops: Shop[];
}

@Entity('districts')
export class District {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => City, (city) => city.districts)
  city: City;

  @Column()
  city_id: string;

  @OneToMany(() => Taluka, (taluka) => taluka.district)
  talukas: Taluka[];
}

@Entity('talukas')
export class Taluka {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => District, (district) => district.talukas)
  district: District;

  @Column()
  district_id: string;

  @OneToMany(() => Shop, (shop) => shop.taluka)
  shops: Shop[];
}
