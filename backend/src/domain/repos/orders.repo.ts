import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { Order } from "@prisma/client";
import { PrismaService } from "libs/prisma/prisma.service";
import { OrderItemsRepo } from "./orderItems.repo";

@Injectable()
export class OrdersRepo  {
  constructor(@Inject(forwardRef(() => OrderItemsRepo)) private readonly orderItemsRepo: OrderItemsRepo, private readonly prisma: PrismaService ) {}

  async createOrder(userId: string) {
      return await this.prisma.order.create({
        data: {
          price: 0,
          user: { connect: { id: userId } },
        },
      });
  }

  async getAll(userId: string) {
    return await this.prisma.order.findMany({
      where: {
        userId: userId
      }
    })
  }
  

  async updateOrderStatus(userId: string, order: Pick<Order, 'status' | 'id'>) {
    return await this.prisma.order.update({
      where: {
        id: order.id,
        userId: userId,
        status: "PENDING",
      },
      include: {
        items: true
    },
      data: { status: order.status },
    });
  }

  async updateOrder(userId: string, order: Pick<Order, 'price' | 'id'>) {

    return await this.prisma.order.update({
      where: {
        id: order.id,
        userId: userId,
        status: "PENDING"
      },
      data: {
        price: order.price
      }
    })
  }
  async getOrdersByStatus(userId: string, order: Pick<Order, 'status'>) {
    return await this.prisma.order.findMany({
        where: {
          userId: userId,
          status: order.status
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          status: true,
          price: true,
          userId: true
        }
      })
}
  async getOrderById(userId: string, order: Pick<Order, 'id'>) {
    return await this.prisma.order.findUnique({
      where: {
        userId: userId,
        id: order.id
      },
      include: {
        items: true
    },
    })
  }

  async checkAmount(userId: string, order: Pick<Order, 'id'>) {
    return this.orderItemsRepo.checkAmount(userId, {orderId: order.id})
  }

  async updateProductAmount( userId: string, order: Pick<Order, 'id'>){
     await this.orderItemsRepo.updateProductAmount(userId, {orderId: order.id})
  }

}