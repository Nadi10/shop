// src/dto/UserDto.ts
import { User } from '@prisma/client';
import { UUIDDto } from './uuid.dto';

export class UserDto extends UUIDDto {
  email: string;
  password: string;
  name?: string;
  token?: string;

  static fromEntity(entity?: User) {
    if (!entity) {
      return;
    }
    const userDto = new UserDto();
    userDto.id = entity.id;
    userDto.createdAt = entity.createdAt.valueOf();
    userDto.updatedAt = entity.updatedAt.valueOf();
    userDto.email = entity.email;
    userDto.password = entity.password;
    userDto.name = entity.name;
    userDto.token = entity.token;
    return userDto;
  }

  static fromEntities(entities?: User[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map((entity) => this.fromEntity(entity));
  }
}
