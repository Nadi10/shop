import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { OrdersRepo } from 'domain/repos/orders.repo';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepo: OrdersRepo ) {}

  async createOrGetOrder(userId: string, order: Pick<Order,'price' |'status'>){
    const existingOrder = await this.ordersRepo.getOrdersByStatus(userId, {status:order.status})
      if (existingOrder.length > 0) {
        return existingOrder[0]; 
    }
    return this.ordersRepo.createOrder(userId);
  }

  async updateStatus(userId: string, order: Pick<Order, 'status' | 'id'>) {
    return await this.ordersRepo.updateOrderStatus(userId, order);
  }

  async getOrdersByStatus(userId: string, order: Pick<Order, 'status'>) {
    return await this.ordersRepo.getOrdersByStatus(userId, order)
  }


  async getOrderById(userId: string, order: Pick<Order, 'id'>) {
    return await this.ordersRepo.getOrderById(userId, order)
  }

  async getAll(userId: string) {
    return await this.ordersRepo.getAll(userId)
  }

  async checkAmount(userId: string, order: Pick<Order, 'id'>) {
    return this.ordersRepo.checkAmount(userId, order)
  }
  async updateProductAmount( userId: string, order: Pick<Order, 'id'>){
    await this.ordersRepo.updateProductAmount(userId, order)
 }

}
