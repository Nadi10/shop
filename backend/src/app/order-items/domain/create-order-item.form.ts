import { IsInt, IsOptional, IsUUID } from "class-validator";

export class CreateOrderItemForm {
  @IsUUID()
  productId: string;

  @IsInt()
  quantity: number;

  @IsUUID()
  orderId: string

  @IsOptional()
  @IsInt()
  price: number

  @IsOptional()
  id: string

}
