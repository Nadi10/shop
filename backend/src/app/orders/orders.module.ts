import { Module } from '@nestjs/common';
import { OrderItemsRepo } from 'domain/repos/orderItems.repo';
import { OrdersRepo } from 'domain/repos/orders.repo';
import { ProductsRepo } from 'domain/repos/products.repo';
import { PrismaModule } from 'libs/prisma/prisma.module';
import { SecurityModule } from 'libs/security/security.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [PrismaModule, SecurityModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepo, OrderItemsRepo, ProductsRepo],
})
export class OrdersModule {}
