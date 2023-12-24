import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersRepo } from 'domain/repos/users.repo';
import { SecurityService } from 'libs/security/security.service';


@Injectable()
export class AuthService {
  constructor(
     private securityService: SecurityService,
     private jwtService: JwtService, 
     private configService: ConfigService,
     private  usersRepo: UsersRepo,
     ) { }

  async createUser(userData: Pick<User, 'email' | 'password' | 'name'>) {
    const hashPassword = await bcrypt.hash(userData.password, 10);
    const user =  await this.usersRepo.createUser({
      email: userData.email , password: hashPassword , name: userData.name
   })
    const tokens = await this.securityService.generateTokens(String(user.id))
     await this.updateRefreshToken(user.id, {token: tokens.refreshToken})
     return user
  }
  
  async login(user: Pick<User, 'email'| 'password' | 'id'>) {
    const tokens = await this.securityService.generateTokens(String(user.id))
    await this.updateRefreshToken(user.id, {token: tokens.refreshToken})
    return {
      user: this.returnUserFields(user),
      ...tokens
  }
  }

  async logout(userId: Pick<User, 'id'>) {
    return this.usersRepo.update({id: userId.id},  null );
  }

  async getNewTokens(user: Pick<User, 'id'>) {
      const tokens = await this.securityService.generateTokens(String(user.id));
      return {
        user: this.returnUserFields(user),
        ...tokens,
      };
  }

  async findUserByEmail(email: Pick<User, 'email'>) {
    return await this.usersRepo.getUserByEmail(email);
  }

  async findUserById(id: Pick<User, 'id'>) {
    return await this.usersRepo.getUserById(id.id);
  }
  

  async validateUser(userData: Pick<User, 'email'| 'password'>) {
    const user =  await this.usersRepo.getUserByEmail({email: userData.email})
    const isValid = await bcrypt.compare(userData.password, user.password)
    return {user, isValid}
  }

  async verifyToken(refreshToken: Pick<User, 'token'>) {
    return await this.jwtService.verifyAsync(refreshToken.token, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  private async updateRefreshToken(userId: string, refreshToken: Pick<User, 'token'>) {
    const hashedRefreshToken = await this.hashData(refreshToken.token);
    await this.usersRepo.update({id: userId}, hashedRefreshToken
    );
  }
  

   returnUserFields(user: Partial <User>) {
    return {
      id: user.id,
      email: user.email
    }
  }

  private hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
}
  
