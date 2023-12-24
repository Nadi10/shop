import { Body, Controller, Delete, Get, HttpCode, NotAcceptableException, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { OrderItemDto } from 'domain/dto/orderItem.dto';
import { CurrentUser } from 'libs/security/decorators/user.decorator';
import { JwtGuard } from 'libs/security/guards/jwt.guard';
import { CreateOrderItemForm } from './domain/create-order-item.form';
import { UpdateOrderItemForm } from './domain/update-order-item-form';
import { OrderItemsService } from './order-items.service';


@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}
  
  @UseGuards(JwtGuard)
  @Post('create-order-item')
  async createOrderItem(@Body() createOrderItemForm: CreateOrderItemForm, @CurrentUser('id') userId: string) {

    const product = await this.orderItemsService.getProduct(createOrderItemForm)
    const updatedAvailableAmount = (parseInt(product.availableAmount) - createOrderItemForm.quantity)
    if(updatedAvailableAmount < 0) {
      throw new NotAcceptableException(`Your item quantity more than existing. Available amount is ${product.availableAmount}`)
    }
    const existingOrderItem = await this.orderItemsService.getOrderItemByProduct(userId, createOrderItemForm)
    if(existingOrderItem) {
      const updatedOrderItemForm: CreateOrderItemForm = {
        ...createOrderItemForm,
        id: existingOrderItem.id,
      };
      const updatingOrderItem = await this.orderItemsService.updateOrderItem(userId, updatedOrderItemForm)
      return updatingOrderItem;

    }
    const createdOrderItem = await this.orderItemsService.createOrderItem(userId, createOrderItemForm);
    return OrderItemDto.fromEntity(createdOrderItem);
  }

  @UseGuards(JwtGuard)
  @Get('get-all-order-items')
  async getAllOrderItems(@Body() createOrderItemForm: CreateOrderItemForm, @CurrentUser('id') userId: string) {
    const entities = await this.orderItemsService.getAllOrderItems(userId, createOrderItemForm);
    
    const entitiesWithNames = await Promise.all(entities.map(async (item) => {
      const productName = await this.orderItemsService.getProductsName({ productId: item.productId });
      return { ...item, productName };
    }));
    return entitiesWithNames
    
}

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Put('update-order-item')
  async updateOrderItem( @CurrentUser('id') userId: string, @Body() updateOrderItemForm: UpdateOrderItemForm) {
    const existingOrderItem = await this.orderItemsService.getOrderItemById(userId, {id: updateOrderItemForm.id})
    if (!existingOrderItem) {
      throw new NotFoundException('Order item not found');
    }
    const updatedOrderItemForm: UpdateOrderItemForm = {
      ...updateOrderItemForm,
      productId: existingOrderItem.productId,
    };
    const product = await this.orderItemsService.getProduct(updatedOrderItemForm)
    const updatedAvailableAmount = (parseInt(product.availableAmount) - updateOrderItemForm.quantity)
    if(updatedAvailableAmount < 0) {
      throw new NotAcceptableException('Your item quantity more than existing')
    }
    const updatedOrderItem = await this.orderItemsService.updateOrderItem(userId, updatedOrderItemForm);
    return OrderItemDto.fromEntity(updatedOrderItem);
}

  @UseGuards(JwtGuard)
  @HttpCode(204)
  @Delete('delete-order-item/:orderItemId')
  async deleteOrderItem(@Param('orderItemId') orderItemId: string, @CurrentUser('id') userId: string) {
    const orderItem = await this.orderItemsService.getOrderItemById(userId, {id: orderItemId});
    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }
    const deletedOrderItem = await this.orderItemsService.deleteOrderItem(userId, { id: orderItemId });
    return OrderItemDto.fromEntity(deletedOrderItem)
}
}

