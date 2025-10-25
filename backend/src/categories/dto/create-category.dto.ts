import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MetalType } from '../../entities/category.entity';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Gold Necklaces' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'gold-necklaces' })
  @IsString()
  slug: string;

  @ApiProperty({ enum: MetalType, example: MetalType.GOLD })
  @IsEnum(MetalType)
  metal_type: MetalType;

  @ApiProperty({ example: 'Beautiful gold necklaces for all occasions', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://example.com/category.jpg', required: false })
  @IsString()
  @IsOptional()
  image_url?: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Gold Necklaces', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Beautiful gold necklaces', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://example.com/category.jpg', required: false })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
