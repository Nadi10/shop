import { BadRequestException, Body, Controller, ForbiddenException, Get, HttpCode, NotFoundException, Post, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { RefreshTokenForm } from 'app/auth/domain/refresh-token.form';
import { UserDto } from 'domain/dto/user.dto';
import { Response } from 'express';
import { JwtGuard } from 'libs/security/guards/jwt.guard';
import { CurrentUser } from '../../libs/security/decorators/user.decorator';
import { AuthService } from './auth.service';
import { AuthForm } from './domain/auth.form';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes( new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(@Body() body: AuthForm ) {
    const form = AuthForm.from(body);
    const errors = await AuthForm.validate(form);
    if (errors) {
      throw new ForbiddenException('InvalidForm', errors.toString());
    }
    const existUser = await this.authService.findUserByEmail(body);
    if(existUser) throw new BadRequestException('User already exists')

    const creatingUser = await this.authService.createUser(body);
    return UserDto.fromEntity(creatingUser)
  }


  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() body: AuthForm, @Res({ passthrough: true }) response: Response) {
    const form = AuthForm.from(body);
    const errors = await AuthForm.validate(form);
    if (errors) {
      throw new ForbiddenException('InvalidForm', errors);
    }
    const { user, isValid } = await this.authService.validateUser(body);
    if (!user) throw new NotFoundException('User not found');
    if (!isValid) throw new UnauthorizedException('Invalid password');

    const tokens = await this.authService.login(user);
   
    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,

    });
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,

    });

    return {tokens};
  }

  @HttpCode(200)
  @Post('/refresh-token')
  async getNewTokens( @Body() refreshToken: RefreshTokenForm) {
    const existUser = await this.authService.findUserById({id: refreshToken.userId})
    if(!existUser) {
      throw new UnauthorizedException
    }
    const result = await this.authService.verifyToken(refreshToken);
    if (!result) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.authService.findUserById({id: refreshToken.userId})
      if(!user) throw new NotFoundException('User not found') 
    try{
      return  await this.authService.getNewTokens(user)
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
      }
      throw new UnauthorizedException('Invalid refresh token');
    } 
  }

  @UsePipes( new ValidationPipe())
  @HttpCode(200)
  @UseGuards(JwtGuard)
  @Get('logout')
  async logOut(@CurrentUser('id') userId: string) {
    this.authService.logout({id: userId});
    return "Successfully logout";
  }

}
 