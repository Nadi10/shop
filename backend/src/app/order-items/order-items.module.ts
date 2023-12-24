import { Module } from '@nestjs/common';
import { OrderItemsRepo } from 'domain/repos/orderItems.repo';
import { OrdersRepo } from 'domain/repos/orders.repo';
import { ProductsRepo } from 'domain/repos/products.repo';
import { PrismaModule } from 'libs/prisma/prisma.module';
import { SecurityModule } from 'libs/security/security.module';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';

@Module({
  imports: [PrismaModule, SecurityModule],
  controllers: [OrderItemsController],
  providers: [OrderItemsService, OrderItemsRepo, OrdersRepo, ProductsRepo],
})
export class OrderItemsModule {}
