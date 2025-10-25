import { IsString, IsNumber, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'shop-uuid' })
  @IsString()
  shop_id: string;

  @ApiProperty({ example: 'Gold Necklace with Diamonds' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'SKU-GOLD-001' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 'Beautiful 22K gold necklace with diamond studding' })
  @IsString()
  description: string;

  @ApiProperty({ example: 15000000, description: 'Price in paise (150000.00 INR)' })
  @IsNumber()
  price_in_paise: number;

  @ApiProperty({ example: 'category-uuid' })
  @IsString()
  category_id: string;

  @ApiProperty({ example: 25.5, required: false })
  @IsNumber()
  @IsOptional()
  weight_grams?: number;

  @ApiProperty({ example: '22K', required: false })
  @IsString()
  @IsOptional()
  purity?: string;

  @ApiProperty({ example: 5, required: false })
  @IsNumber()
  @IsOptional()
  stock_quantity?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_available?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  has_ar_model?: boolean;

  @ApiProperty({ example: 'https://example.com/ar-model.glb', required: false })
  @IsString()
  @IsOptional()
  ar_model_url?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  try_at_home_available?: boolean;

  @ApiProperty({ example: ['gold', 'necklace', 'diamond', 'wedding'], required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class UpdateProductDto {
  @ApiProperty({ example: 'Gold Necklace with Diamonds', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Beautiful 22K gold necklace', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 15000000, required: false })
  @IsNumber()
  @IsOptional()
  price_in_paise?: number;

  @ApiProperty({ example: 5, required: false })
  @IsNumber()
  @IsOptional()
  stock_quantity?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_available?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  try_at_home_available?: boolean;
}

export class AddProductImageDto {
  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  image_url: string;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  display_order?: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;
}
