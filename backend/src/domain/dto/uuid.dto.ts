import { IsNumber, IsUUID } from "class-validator";

export class UUIDDto {
  @IsUUID()
  id: string

  @IsNumber()
  createdAt: number

  @IsNumber()
  updatedAt: number
}