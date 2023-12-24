// src/dto/OrderItemDto.ts
import { OrderItem } from '@prisma/client';
import { UUIDDto } from './uuid.dto';

export class OrderItemDto extends UUIDDto {
  quantity: number;
  price: number;
  orderId: string;
  productId: string;

  static fromEntity(entity?: OrderItem) {
    if (!entity) {
      return;
    }
    const orderItemDto = new OrderItemDto();
    orderItemDto.id = entity.id;
    orderItemDto.createdAt = entity.createdAt.valueOf();
    orderItemDto.updatedAt = entity.updatedAt.valueOf();
    orderItemDto.quantity = entity.quantity;
    orderItemDto.price = entity.price;
    orderItemDto.orderId = entity.orderId;
    orderItemDto.productId = entity.productId;
    return orderItemDto;
  }

  static fromEntities(entities?: OrderItem[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map((entity) => this.fromEntity(entity));
  }
}
