import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import * as jwt  from "jsonwebtoken"
import { userTokenType } from "../decorators/user.decorator";
import { PrismaService } from "src/prisma/prisma.service";
import { UserType } from "@prisma/client";


@Injectable()
export class AuthGuard implements CanActivate {
constructor(private readonly reflector :Reflector,private readonly PrismaService : PrismaService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
       
        const roles =this.reflector.getAllAndOverride("roles",[context.getHandler(),context.getClass()]) as UserType[]
      
        if(roles?.length>0){
             const request = context.switchToHttp().getRequest();
              const token = request?.headers?.auth?.split("Bearer ")[1]
        try {
            const payload= await jwt.verify(token,process.env.JSON_WEB_TOKEN) as userTokenType
            const user= await this.PrismaService.user.findUnique({where:{id:payload.id}})
            if(!user) return false
            if(!roles.includes(user.userType))return false
        } catch (err) {
            console.log(err)
            return false
        }
        
    }
            
           
  
        return true
    }

}