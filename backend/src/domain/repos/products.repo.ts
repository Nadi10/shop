import { Injectable } from "@nestjs/common";
import { Product } from "@prisma/client";
import { PrismaService } from "libs/prisma/prisma.service";

@Injectable()
export class ProductsRepo  {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts() {
    return await this.prisma.product.findMany({
    
    });
  }
  async getProductById(id: string) {
    return await this.prisma.product.findUnique({
      where: { id }    });
  }
  async getProductAvailableAmount(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { availableAmount: true },
    });

    return product.availableAmount;
  }

  async updateAvailableAmount(product: Pick<Product, 'id' | 'availableAmount'>) {
    return await this.prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        availableAmount: product.availableAmount
      }
    })
  }
 
  async getProductsName(product: Pick<Product, 'id'>) {
    return await this.prisma.product.findUnique({
      where: {
        id: product.id
      }
    })
  }

  

}