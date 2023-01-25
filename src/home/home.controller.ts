import { Controller ,Get,NotFoundException,Post,UnauthorizedException} from '@nestjs/common';
import { HomeService } from './home.service';
import { Param ,Query,Body, Delete, Patch, UseGuards} from '@nestjs/common/decorators';
import { createHome, homeResponseDto, inquireDto, updateHomeDto } from './dtos/home.dto';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { PropertyType, UserType } from '@prisma/client';
import { User, userTokenType } from 'src/user/decorators/user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';



@Controller('home')
export class HomeController {
    constructor(private readonly HomeService:HomeService) {}

    @Get("")
    getHomes (@Query("city") city? :string,
    @Query("propertyType") propertyType? :PropertyType,
    @Query("minPrice") minPrice? :string,
    @Query("maxPrice") maxPrice? :string )
    :Promise<homeResponseDto[]>{
        return this.HomeService.getHomes(city,propertyType,minPrice,maxPrice);
    }
     @Get(":id")
    getHomeById(@Param("id",ParseIntPipe) id:number ):Promise<homeResponseDto>{
        return this.HomeService.getHomeById(id)
    }   
        @Roles(UserType.REALTOR) 
       @Get(":id/messages")
    async getMessagesByHomeId(@Param("id",ParseIntPipe) id:number,@User() user :userTokenType ){
    
        return this.HomeService.getMessagesByHomeId(id,user.id)
    }
    
    @Post(":id/inquire")
    inquireHomeById(@Body()  body:inquireDto,@User() user :userTokenType,@Param("id",ParseIntPipe) id:number  ){
        return this.HomeService.inquireHomeById(body.messageText,id,user.id);

    }
    @Roles(UserType.ADMIN,UserType.REALTOR)
    @Post("")
    createHome(@Body()  body:createHome,@User() user :userTokenType ){
        return this.HomeService.createHome(body,user.id);

    }
     @Roles(UserType.REALTOR)
    @Delete(":id")
    async deleteHomeById(@Param("id",ParseIntPipe) id:number,@User() user :userTokenType){
        const realtor_id =   await this.HomeService.getRealtorByHomeId(id)
        if( realtor_id!==user.id) throw new UnauthorizedException("Not authorized")
        return this.HomeService.deleteHomeById(id);
    }
     @Roles(UserType.REALTOR)
    @Patch(":id")
    async updateHomeById(@Param("id",ParseIntPipe) id:number,@Body() Body:updateHomeDto,@User() user :userTokenType){
           const realtor_id =   await this.HomeService.getRealtorByHomeId(id)
           if(user==undefined)throw new UnauthorizedException("Not authorized")
        if( realtor_id!==user.id ) throw new UnauthorizedException("Not authorized")
        return this.HomeService.updateHomeById(id,Body);
    }
    
}
