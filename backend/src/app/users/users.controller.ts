import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { UserDto } from 'domain/dto/user.dto';
import { CurrentUser } from 'libs/security/decorators/user.decorator';
import { JwtGuard } from 'libs/security/guards/jwt.guard';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtGuard)
  async getProfile(@CurrentUser('id') id: string ) {
    const user = await this.usersService.getUserById(id);
    if(!user) {
      throw new NotFoundException('User not found')
    }
    return UserDto.fromEntity(user)
  }

}
