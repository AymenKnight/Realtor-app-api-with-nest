import { ConflictException, HttpException, Injectable, NotFoundException ,} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt  from "bcryptjs"
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

interface signUpProps {
     name: string;
       email: string;
        phoneNumber: string;
        password: string;
}
interface signInProps {
       email: string;
        password: string;
}
interface generateProductKeyProps {
   email: string;
     userType : UserType
}

@Injectable()
export class AuthService {
  constructor(private readonly PrismaService :PrismaService){}

 async signUp({name,email,password,phoneNumber}:signUpProps,userType: UserType) {
    const userExisted= await this.PrismaService.user.findUnique({where:{email}})
    if(userExisted){
        throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.PrismaService.user.create(
        {data:{email, password:hashedPassword,phoneNumber,name,userType}})
    
        const token = await this.generateToken(name,newUser.id)
        
        return token


  }
 async signIn({email,password}:signInProps) {
   const userExisted= await this.PrismaService.user.findUnique({where:{email}})
   if(!userExisted){
       throw new HttpException("Invalid Credentials",400);}
       const isValidPassword = await bcrypt.compare(password,userExisted.password)
       if(!isValidPassword) throw new HttpException("Invalid Credentials",400)
        const token = await this.generateToken(userExisted.name,userExisted.id)
       return   token
      

 }

async generateProductKey({email,userType}:generateProductKeyProps){
    const keyString= `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}` 
    const hashedKey = await bcrypt.hash(keyString,10)
    return hashedKey
    
}

  private async  generateToken(name:string,id:number){
  const token = await jwt.sign({name,id},process.env.JSON_WEB_TOKEN,{expiresIn:36000}) 
  return  token
 }
}
