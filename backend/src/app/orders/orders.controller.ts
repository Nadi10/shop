import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, MethodNotAllowedException, Post, UseGuards } from '@nestjs/common';
import { CreateOrderForm } from 'app/orders/domain/create-order.form';
import { OrderDto } from 'domain/dto/order.dto';
import { CurrentUser } from 'libs/security/decorators/user.decorator';
import { JwtGuard } from 'libs/security/guards/jwt.guard';
import { UpdateOrderForm } from './domain/update-order.form';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {
  }

  @UseGuards(JwtGuard)
  @Post('create-order')
  async createOrGetOrder(@Body() createOrderForm: CreateOrderForm, @CurrentUser('id') userId: string) {
    if (createOrderForm.status !== "PENDING"){
      throw new MethodNotAllowedException('Impossible to create order with not PENDING status')
    }
    const order =  await this.ordersService.createOrGetOrder(userId, createOrderForm);
    if(!order) throw new HttpException('Failed to create order', HttpStatus.INTERNAL_SERVER_ERROR);
    return OrderDto.fromEntity(order)
  }

  @Get('get-all')
  @UseGuards(JwtGuard)
  async getAll(@CurrentUser('id') userId: string) {
    const entities = await this.ordersService.getAll(userId)
    return OrderDto.fromEntities(entities)
  }
  
  @Get('get-orders-by-status')
  @UseGuards(JwtGuard)
  async getOrdersByStatus(@Body() updateOrderForm: UpdateOrderForm, @CurrentUser('id') userId: string) {
    const entities = await this.ordersService.getOrdersByStatus(userId, updateOrderForm)
    if(entities.length <=1) {
      return OrderDto.fromEntity(entities[0])
    }
    return OrderDto.fromEntities(entities)

  }

  @HttpCode(200)
  @UseGuards(JwtGuard)
  @Post('update-status')
  async updateStatus(@Body() updateOrderForm: UpdateOrderForm, @CurrentUser('id') userId: string) {
    const existingOrder = await this.ordersService.getOrderById(userId, updateOrderForm)
    if(existingOrder.status === "SHIPPED"){
      throw new MethodNotAllowedException('Impossible to update order with SHIPPED status')
    }
    if(existingOrder.items.length <= 0){
      throw new MethodNotAllowedException('Impossible to update order status without order items ')
    }
    if(updateOrderForm.status === "SHIPPED") {
      const checkAvailableAmount = await this.ordersService.checkAmount(userId, updateOrderForm)
      if(checkAvailableAmount) {
        await this.ordersService.updateProductAmount(userId, updateOrderForm)
      }
    }
    
    const updatedOrder = await this.ordersService.updateStatus(userId, updateOrderForm);
    return OrderDto.fromEntity(updatedOrder)
  }   
}
