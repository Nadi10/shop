import { IsOptional, IsPositive, IsString } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  page: string

  @IsString()
  @IsPositive()
  @IsOptional()

  perPage: string

}