import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State, City, District, Taluka } from '../entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(State)
    private stateRepository: Repository<State>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(Taluka)
    private talukaRepository: Repository<Taluka>,
  ) {}

  async getAllStates() {
    return this.stateRepository.find();
  }

  async getState(id: string) {
    const state = await this.stateRepository.findOne({
      where: { id },
      relations: ['cities'],
    });

    if (!state) {
      throw new NotFoundException('State not found');
    }

    return state;
  }

  async getCitiesByState(stateId: string) {
    return this.cityRepository.find({
      where: { state_id: stateId },
      relations: ['state'],
    });
  }

  async getCity(id: string) {
    const city = await this.cityRepository.findOne({
      where: { id },
      relations: ['state', 'districts'],
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    return city;
  }

  async getDistrictsByCity(cityId: string) {
    return this.districtRepository.find({
      where: { city_id: cityId },
      relations: ['city'],
    });
  }

  async getDistrict(id: string) {
    const district = await this.districtRepository.findOne({
      where: { id },
      relations: ['city', 'talukas'],
    });

    if (!district) {
      throw new NotFoundException('District not found');
    }

    return district;
  }

  async getTalukasByDistrict(districtId: string) {
    return this.talukaRepository.find({
      where: { district_id: districtId },
      relations: ['district'],
    });
  }

  async getTaluka(id: string) {
    const taluka = await this.talukaRepository.findOne({
      where: { id },
      relations: ['district'],
    });

    if (!taluka) {
      throw new NotFoundException('Taluka not found');
    }

    return taluka;
  }

  async createState(name: string, code: string) {
    const state = this.stateRepository.create({ name, code });
    return this.stateRepository.save(state);
  }

  async createCity(name: string, stateId: string) {
    const city = this.cityRepository.create({ name, state_id: stateId });
    return this.cityRepository.save(city);
  }

  async createDistrict(name: string, cityId: string) {
    const district = this.districtRepository.create({ name, city_id: cityId });
    return this.districtRepository.save(district);
  }

  async createTaluka(name: string, districtId: string) {
    const taluka = this.talukaRepository.create({ name, district_id: districtId });
    return this.talukaRepository.save(taluka);
  }
}
