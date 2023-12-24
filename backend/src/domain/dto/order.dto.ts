// src/dto/OrderDto.ts
import { Order } from '@prisma/client';
import { UUIDDto } from './uuid.dto';

export class OrderDto extends UUIDDto {
  status: string;
  price: number;

  static fromEntity(entity?: Order) {
    if (!entity) {
      return;
    }
    const orderDto = new OrderDto();
    orderDto.id = entity.id;
    orderDto.createdAt = entity.createdAt.valueOf();
    orderDto.updatedAt = entity.updatedAt.valueOf();
    orderDto.status = entity.status;
    orderDto.price = entity.price;
    return orderDto;
  }

  static fromEntities(entities?: Order[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map((entity) => this.fromEntity(entity));
  }
}
