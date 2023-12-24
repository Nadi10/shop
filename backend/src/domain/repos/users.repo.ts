import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "libs/prisma/prisma.service";

@Injectable()
export class UsersRepo  {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(userData: Pick<User, 'email'| 'password' | 'name'>) {
    return await this.prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        name: userData.name
      }
    })
  }

  async getUserByEmail(userData: Pick<User, 'email'>) {
    return await this.prisma.user.findUnique({
      where: {
        email: userData.email
      }
    })
  }

  
  async getUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: id
      }
    })
  }

  async update(user: Pick<User, 'id'>, token: any) {
    return await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {token: token}
    })
  }
}