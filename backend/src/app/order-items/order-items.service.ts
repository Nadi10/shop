// order-items.service.ts
import { Injectable } from '@nestjs/common';
import { OrderItem } from '@prisma/client';
import { OrderItemsRepo } from 'domain/repos/orderItems.repo';


@Injectable()
export class OrderItemsService {
  constructor(private readonly orderItemsRepo: OrderItemsRepo) {}
 
  async createOrderItem(userId: string, orderItem: Pick<OrderItem, 'quantity' | 'productId' | 'orderId' | 'price'>) {
    return await this.orderItemsRepo.createOrderItem(userId, orderItem);
  }

  async getAllOrderItems(userId: string, orderItem: Pick<OrderItem, 'orderId'>) {
    return await this.orderItemsRepo.getAllOrderItems(userId, orderItem)
  }
  async deleteOrderItem(userId: string, orderItemId: Pick<OrderItem, 'id'>) {
    return await this.orderItemsRepo.deleteOrderItem(userId, orderItemId);
  }
  async getOrderItemById(userId: string, orderItem: Pick<OrderItem, 'id'>) {
    return await this.orderItemsRepo.getOrderItemById(userId, {id: orderItem.id})
  }

  async getOrderItemByProduct(userId: string, orderItem: Pick<OrderItem, 'productId' | 'orderId'>) {
    return await this.orderItemsRepo.getOrderItemByProduct(userId, orderItem)
  }
  async updateOrderItem(userId: string, orderItem: Pick<OrderItem, 'id'| 'quantity'| 'price' | 'productId'>) {
    return await this.orderItemsRepo.updateOrderItem(userId, orderItem)
  }
  async getProduct(productId: Pick<OrderItem, 'productId'>) {
    return await this.orderItemsRepo.getProduct(productId)
  }
  async getProductsName(orderItem: Pick<OrderItem, 'productId'>) {
    return  await this.orderItemsRepo.getProductsName(orderItem)
   }
  
}
