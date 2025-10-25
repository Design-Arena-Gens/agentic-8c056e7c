import { IsString, IsEnum, IsOptional, IsArray, ValidateNested, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderType } from '../../entities/order.entity';

export class OrderItemDto {
  @ApiProperty({ example: 'product-uuid' })
  @IsString()
  product_id: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ enum: OrderType, example: OrderType.ONLINE_PURCHASE })
  @IsEnum(OrderType)
  order_type: OrderType;

  @ApiProperty({ example: '123 Main Street, Apartment 4B', required: false })
  @IsString()
  @IsOptional()
  delivery_address?: string;

  @ApiProperty({ example: 'Mumbai', required: false })
  @IsString()
  @IsOptional()
  delivery_city?: string;

  @ApiProperty({ example: 'Maharashtra', required: false })
  @IsString()
  @IsOptional()
  delivery_state?: string;

  @ApiProperty({ example: '400001', required: false })
  @IsString()
  @IsOptional()
  delivery_pincode?: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsString()
  @IsOptional()
  delivery_phone?: string;

  @ApiProperty({ example: '2024-12-25T10:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  scheduled_date?: string;

  @ApiProperty({ example: 'Please call before delivery', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
