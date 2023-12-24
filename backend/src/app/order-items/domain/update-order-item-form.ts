import { IsInt, IsOptional, IsUUID } from "class-validator";

export class UpdateOrderItemForm {

  @IsInt()
  quantity: number;

  @IsInt()
  price: number

  @IsUUID()
  id: string

  @IsOptional()
  productId: string


  @IsOptional()
  orderId: string
}
