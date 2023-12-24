import { EnumOrderStatus } from '@prisma/client';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class UpdateOrderForm {
  @IsString()
  status: EnumOrderStatus;

  @IsNumber()
  price: number;

  @IsUUID()
  id: string;

  @IsUUID()
  orderId: string;

  @IsUUID()
  productId: string;
}
