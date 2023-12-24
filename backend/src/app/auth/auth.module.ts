import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'app/users/users.module';

import { PrismaModule } from 'libs/prisma/prisma.module';
import { SecurityModule } from 'libs/security/security.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepo } from 'domain/repos/users.repo';


@Module({
  imports: [SecurityModule, PrismaModule, ConfigModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, UsersRepo],
})
export class AuthModule {}
 