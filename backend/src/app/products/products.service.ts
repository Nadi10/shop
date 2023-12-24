import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { ProductsRepo } from 'domain/repos/products.repo';

@Injectable()
export class ProductsService {
  constructor(private productsRepo: ProductsRepo) {}

  async getAll() {
    // const { page, perPage } = this.getPagination(paginationDto);
    return this.productsRepo.getAllProducts()
  }
  async getProductById(id: string) {
    return await this.productsRepo.getProductById(id);
  }

  async updateAvailableAmount(product: Pick<Product, 'id' | 'availableAmount'>) {
    return await this.productsRepo.updateAvailableAmount(product)
  }

  // private getPagination(dto: PaginationDto, defaultPerPage = 10) {
  //   const page = parseInt(dto.page);
  //   const perPage = dto.perPage ? +dto.perPage : defaultPerPage;
  //   const skip = (page - 1) * perPage;
  //   return { page, perPage, skip };
  // }

} 
