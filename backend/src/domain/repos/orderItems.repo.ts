import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { OrderItem } from '@prisma/client';
import { Pick } from '@prisma/client/runtime/library';
import { PrismaService } from 'libs/prisma/prisma.service';
import { OrdersRepo } from './orders.repo';
import { ProductsRepo } from './products.repo';

@Injectable()
export class OrderItemsRepo {
  constructor(@Inject(forwardRef(() => OrdersRepo))  private readonly ordersRepo: OrdersRepo, private readonly prisma: PrismaService, private readonly productsRepo: ProductsRepo) {}
  
  async createOrderItem(userId: string, orderItem: Pick<OrderItem, 'quantity' | 'productId' | 'orderId'>) {
    const order = await this.ordersRepo.getOrdersByStatus(userId, {status: "PENDING"} )
    const orderId = order[0].id
    const price = await this.updateOrderItemPrice(orderItem)
    
      const creatingOrderItem =  await this.prisma.orderItem.create({
        data: {
          price: price,
          quantity: orderItem.quantity,
          product: { connect: { id: orderItem.productId } },
          order: { connect: { userId: userId, status: 'PENDING', id: orderId } },
        },
      });
      await this.updateOrderPrice(userId, orderId);
        return creatingOrderItem;
  }

  async getAllOrderItems(userId: string, orderItem: Pick<OrderItem, 'orderId'>) {
      return await this.prisma.orderItem.findMany({
        where: {
          order: {id: orderItem.orderId,
                  userId: userId,
                status: "PENDING"}
        }
      })
  } 

  async getOrderItemById(userId: string, orderItemId: Pick<OrderItem, 'id'>) {
      return await this.prisma.orderItem.findFirst({
        where: {
          id: orderItemId.id,
          order: {userId: userId, status: "PENDING"}
        },
      });
  }
  async getOrderItemByProduct(userId: string, orderItem: Pick<OrderItem, 'productId' | 'orderId'>) {
    return await this.prisma.orderItem.findFirst({
      where: {
        productId: orderItem.productId,
        orderId: orderItem.orderId,
        order: {
          status: "PENDING"
        }
      }
    });  
  }

  async updateOrderItem(userId: string, orderItem: Pick<OrderItem, 'id'| 'quantity' | 'productId'>) {
    const price = await this.updateOrderItemPrice(orderItem)

    const updatedOrderItem =  await this.prisma.orderItem.update({
      where: {
        id: orderItem.id,
        order: {
          status: "PENDING"
        }
      },
      data: {
        quantity: orderItem.quantity,
        price: price
      }
    })
    await this.updateOrderPrice(userId, updatedOrderItem.orderId);
    return updatedOrderItem
  }

  async deleteOrderItem(userId: string, orderItemId: Pick<OrderItem, 'id'>) {
      const item =  await this.prisma.orderItem.delete({
        where: {
          id: orderItemId.id,
          order: { status:  "PENDING"}
        }
      });
      await this.updateOrderPrice(userId, item.orderId);
      return item

  }
 

  async getProduct(productId: Pick<OrderItem, 'productId'>) {
    const product =  await this.productsRepo.getProductById(productId.productId)
    return product
  }

 


  async checkAmount(userId: string, order: Pick<OrderItem, 'orderId'>) {
   const items =  await this.getAllOrderItems(userId, order)
   const checkAmountPromises = items.map(async (orderItem) => {
    const product = await this.getProduct(orderItem);

    if (orderItem.quantity > parseInt(product.availableAmount)) {
      throw new Error(`Not enough availableAmount for product with id ${product.id}`);
    }
    return true; 
  });
  await Promise.all(checkAmountPromises);

  return true
  }

  private async countOrderPrice(userId: string, orderId: string) {
    const orderItems = await this.getAllOrderItems(userId, { orderId: orderId });

  return orderItems.reduce((accumulator, orderItem) => {
  return accumulator + orderItem.price * orderItem.quantity;
}, 0);

  }
  private async updateOrderPrice(userId: string, orderId: string) {
    const price = await this.countOrderPrice(userId, orderId);
    const data = {
      id: orderId, 
      price
    }
    await this.ordersRepo.updateOrder(userId, data);
  }
  private async updateOrderItemPrice(orderItem: Pick<OrderItem, 'quantity' | 'productId'>) {
    const product = await this.getProduct(orderItem)
    return product.price * orderItem.quantity
  }


  async updateProductAmount(userId: string, orderItem: Pick<OrderItem, 'orderId'>) {
    const productItems = await this.getAllOrderItems(userId, { orderId: orderItem.orderId });

    await Promise.all(productItems.map(async (item) => {
      const newAvailableAmount = await this.calculateNewAvailableAmount(item);  
      await this.productsRepo.updateAvailableAmount({
        id: item.productId, 
        availableAmount: newAvailableAmount.toString(),
      });
    }));
}

  async getProductsName(orderItem: Pick<OrderItem, 'productId'>) {
   const product =  await this.productsRepo.getProductsName({id: orderItem.productId})
   return product.name
  }

  private async calculateNewAvailableAmount(orderItem: OrderItem) {

    const currentAvailableAmount = await this.productsRepo.getProductAvailableAmount(orderItem.productId)
    const orderQuantity = orderItem.quantity;
    const newAvailableAmount = parseInt(currentAvailableAmount) - orderQuantity;

    return newAvailableAmount;
}

}
