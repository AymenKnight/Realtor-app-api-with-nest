import { UserType } from '@prisma/client';
import { IsString, IsNotEmpty, IsEmail ,Matches,MinLength, IsEnum, IsOptional} from 'class-validator';


export class signUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @Matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
  phoneNumber: string;
  @IsString()
  @MinLength(5)
  password: string;
  @IsOptional()
   @IsString()
  @IsNotEmpty()
  productKey?: string;
}
export class signInDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(5)
  password: string;
}

export class generateProductKeyDto {
    @IsEmail()
  email: string;
  @IsEnum(UserType)
  userType : UserType
}
