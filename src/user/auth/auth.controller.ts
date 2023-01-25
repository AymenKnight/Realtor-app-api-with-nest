import { Body, Controller, Post,Get } from '@nestjs/common';
import { Param, UseGuards } from '@nestjs/common/decorators';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ParseEnumPipe } from '@nestjs/common/pipes';
import { UserType } from '@prisma/client';
import { generateProductKeyDto, signInDto, signUpDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';
import * as bcrypt  from "bcryptjs"
import { User, userTokenType } from '../decorators/user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp/:userType')
 async signUp(@Body() body:signUpDto,@Param("userType",new ParseEnumPipe(UserType)) userType : UserType ) {

    if(userType!="BUYER") {
      if(body.productKey==undefined) throw new UnauthorizedException()
      const correctkey= `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`
      const isValidProductKey= await  bcrypt.compare(correctkey,body.productKey)
      if(!isValidProductKey) throw new UnauthorizedException()
    }
    return this.authService.signUp(body,userType);
  }

  @Post('signIn')
  signIn(@Body() body:signInDto) {
    return this.authService.signIn(body);
  }
    @Roles(UserType.ADMIN)
  @Post("/key")
  generateProductKey(@Body() body:generateProductKeyDto) {
    return this.authService.generateProductKey(body);

  }
    @Get("/me")
  me(@User()  user:userTokenType) {
    return user

  }
}
