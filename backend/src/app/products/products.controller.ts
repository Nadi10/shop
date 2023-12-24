import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ProductDto } from 'domain/dto/product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get()
  async getAllProducts() { 
    const entities = await this.productsService.getAll()
    return ProductDto.fromEntities(entities)
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const product = await this.productsService.getProductById(id);
    return ProductDto.fromEntity(product)
  }

  @Put('update-amount')
  async updateAvailableAmount(@Body()data: { id: string; availableAmount: string }){

    this.productsService.updateAvailableAmount(data)
  }

  
}

