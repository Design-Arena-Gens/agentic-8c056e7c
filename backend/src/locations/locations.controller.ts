import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocationsService } from './locations.service';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('states')
  @ApiOperation({ summary: 'Get all states' })
  @ApiResponse({ status: 200, description: 'Returns all states' })
  getAllStates() {
    return this.locationsService.getAllStates();
  }

  @Get('states/:id')
  @ApiOperation({ summary: 'Get state by ID' })
  getState(@Param('id') id: string) {
    return this.locationsService.getState(id);
  }

  @Get('states/:stateId/cities')
  @ApiOperation({ summary: 'Get all cities in a state' })
  getCitiesByState(@Param('stateId') stateId: string) {
    return this.locationsService.getCitiesByState(stateId);
  }

  @Get('cities/:id')
  @ApiOperation({ summary: 'Get city by ID' })
  getCity(@Param('id') id: string) {
    return this.locationsService.getCity(id);
  }

  @Get('cities/:cityId/districts')
  @ApiOperation({ summary: 'Get all districts in a city' })
  getDistrictsByCity(@Param('cityId') cityId: string) {
    return this.locationsService.getDistrictsByCity(cityId);
  }

  @Get('districts/:id')
  @ApiOperation({ summary: 'Get district by ID' })
  getDistrict(@Param('id') id: string) {
    return this.locationsService.getDistrict(id);
  }

  @Get('districts/:districtId/talukas')
  @ApiOperation({ summary: 'Get all talukas in a district' })
  getTalukasByDistrict(@Param('districtId') districtId: string) {
    return this.locationsService.getTalukasByDistrict(districtId);
  }

  @Get('talukas/:id')
  @ApiOperation({ summary: 'Get taluka by ID' })
  getTaluka(@Param('id') id: string) {
    return this.locationsService.getTaluka(id);
  }
}
