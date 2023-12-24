import { Injectable } from '@nestjs/common';
import { UsersRepo } from 'domain/repos/users.repo';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepo
  ) {}

  
  async getUserById(id: string) {
    return await this.usersRepo.getUserById(id)
  }
}


 