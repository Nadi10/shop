import { Product } from '@prisma/client';
import { UUIDDto } from './uuid.dto';

export class ProductDto extends UUIDDto {
  name: string;
  description: string;
  price: number;
  image: string;
  availableAmount: string;

  static fromEntity(entity?: Product) {
    if (!entity) {
      return;
    }
    const productDto = new ProductDto();
    productDto.id = entity.id;
    productDto.createdAt = entity.createdAt.valueOf();
    productDto.updatedAt = entity.updatedAt.valueOf();
    productDto.name = entity.name;
    productDto.description = entity.description;
    productDto.price = entity.price;
    productDto.image = entity.image;
    productDto.availableAmount = entity.availableAmount;
    return productDto;
  }

  static fromEntities(entities?: Product[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map((entity) => this.fromEntity(entity));
  }
}
