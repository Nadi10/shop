import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrderForm {

  @IsString()
  status: "PENDING";

  @IsOptional()
  @IsNumber()
  price: number;

  @IsUUID()
  id: string;

  @IsUUID()
  orderId: string;

  @IsUUID()
  productId: string;
}


