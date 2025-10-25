import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MembershipStatus } from '../../entities/shop.entity';

export class CreateShopDto {
  @ApiProperty({ example: 'Golden Jewelers' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'city-uuid' })
  @IsString()
  city_id: string;

  @ApiProperty({ example: 'taluka-uuid', required: false })
  @IsString()
  @IsOptional()
  taluka_id?: string;

  @ApiProperty({ example: '123 Main Street, Market Area' })
  @IsString()
  address: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  whatsapp: string;

  @ApiProperty({ example: 'https://example.com/logo.png', required: false })
  @IsString()
  @IsOptional()
  logo_url?: string;

  @ApiProperty({ example: 19.0760, description: 'Latitude' })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 72.8777, description: 'Longitude' })
  @IsNumber()
  lng: number;

  @ApiProperty({ example: 'Premium jewelry shop with 20 years experience', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateShopDto {
  @ApiProperty({ example: 'Golden Jewelers', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '123 Main Street, Market Area', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiProperty({ example: 'https://example.com/logo.png', required: false })
  @IsString()
  @IsOptional()
  logo_url?: string;

  @ApiProperty({ example: 'Premium jewelry shop', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: MembershipStatus, required: false })
  @IsEnum(MembershipStatus)
  @IsOptional()
  membership_status?: MembershipStatus;
}
