import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'app/auth/auth.module';
import { UsersModule } from 'app/users/users.module';
import * as cors from 'cors';
import { PrismaModule } from 'libs/prisma/prisma.module';
import { SecurityModule } from 'libs/security/security.module';
import { OrderItemsModule } from './app/order-items/order-items.module';
import { OrdersModule } from './app/orders/orders.module';
import { ProductsModule } from './app/products/products.module';




@Module({
  imports: [ ConfigModule.forRoot({isGlobal: true,}),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({ secret: config.get('JWT_SECRET') })
  }),
  SecurityModule,
  AuthModule,
  UsersModule,
  PrismaModule,
  ProductsModule,
  OrdersModule,
  OrderItemsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
