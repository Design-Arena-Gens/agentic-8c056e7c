import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'product-uuid', required: false })
  @IsString()
  @IsOptional()
  product_id?: string;

  @ApiProperty({ example: 'shop-uuid', required: false })
  @IsString()
  @IsOptional()
  shop_id?: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Excellent product! Highly recommended.', required: false })
  @IsString()
  @IsOptional()
  comment?: string;
}
