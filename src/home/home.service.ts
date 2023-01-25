import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { homeResponseDto } from './dtos/home.dto';

interface createHomeProps {
   address :string
  number_of_bedrooms :number
    number_of_bathrooms :number
    city :string
    price :number
    land_size :number
    propertyType  :PropertyType
    images :{url:string}[]
}
interface updateHomeProps {
   address? :string
  number_of_bedrooms ?:number
    number_of_bathrooms ?:number
    city? :string
    price? :number
    land_size? :number
    propertyType?  :PropertyType
}

@Injectable()
export class HomeService {
       constructor(private readonly PrismaService:PrismaService) {}

     async  getHomes(city?:string,propertyType?:PropertyType,minPrice?:string,maxPrice?:string):Promise<homeResponseDto[]>{
        const price= minPrice || maxPrice ? {...(minPrice && {gte :parseFloat(minPrice)}),...(maxPrice && {lte:parseFloat(maxPrice)})} :undefined
        const filter ={
            ...(city && {city}),
            ...(propertyType && {propertyType}),
            ...(price && {price})
        }

        const homes= await this.PrismaService.home.findMany({select:{id:true,address:true,city:true,createdAt:true,updatedAt:true,land_size:true,listed_date:true,number_of_bathrooms:true,number_of_bedrooms:true,price:true,propertyType:true,realtor_id:true,images:{select:{url:true},take:1}},
        where :filter})
        if(!homes.length)throw new NotFoundException("no homes found")
        return homes.map((home)=>{
            const transformedHome = {...home,image:home.images[0].url}
            delete transformedHome.images
            return  new homeResponseDto(transformedHome) } )
       }

        async  getHomeById(homeId:number):Promise<homeResponseDto>{
        const home= await this.PrismaService.home.findUnique({where:{id:homeId},select:{id:true,address:true,city:true,createdAt:true,updatedAt:true,land_size:true,listed_date:true,number_of_bathrooms:true,number_of_bedrooms:true,price:true,propertyType:true,realtor_id:true,images:{select:{url:true},take:1}}})
        if(!home) throw new NotFoundException("no home found")
        const transformedHome = {...home,image:home.images[0].url}
            delete transformedHome.images
        return new homeResponseDto(transformedHome)
       }

       async getMessagesByHomeId(homeId:number,userId:number){
        const home= await this.PrismaService.home.findUnique({where:{id:homeId},select:{realtor:true}})
              if(home==undefined) throw new NotFoundException("No home found")
              if(home.realtor.id!=userId) throw new UnauthorizedException("Unauthorized")
              return  await this.PrismaService.message.findMany({where:{home_id:homeId},select:{buyer:{select:{name:true,email:true,phoneNumber:true,}}}})
       }

       async inquireHomeById(msg:string, homeId:number,userId:number) {
        const realtor = await this.PrismaService.home.findUnique({where:{id:homeId},select:{realtor:true}})
        if(!realtor) throw new NotFoundException("no home found")
        const newMessage =await this.PrismaService.message.create({data:
          {messageText:msg,realtor_id:realtor.realtor.id,buyer_id:userId,home_id:homeId}})
          return newMessage


       }

       async createHome({address,city,land_size,number_of_bathrooms,number_of_bedrooms,price,propertyType,images} :createHomeProps,userId:number){
            const newHome= await this.PrismaService.home.create({data:{address,city,land_size,number_of_bathrooms,number_of_bedrooms,price,propertyType,realtor_id:userId}})
            const homeImages = images.map((img)=>{
                return {...img,home_id :newHome.id}})
            const  imagesCreated = await this.PrismaService.image.createMany({data:homeImages})
             return new homeResponseDto(newHome)

       }

       async deleteHomeById(id :number) {
            const homeExisted = await this.PrismaService.home.findUnique({where:{id}})
          if(!homeExisted) throw new NotFoundException("no home found")
        await this.PrismaService.message.deleteMany({ where:{home_id:id}})
        await this.PrismaService.image.deleteMany({where:{home_id:id}})
        await this.PrismaService.home.delete({where:{id}})
       }
       async updateHomeById(id:number,data :updateHomeProps) {
          const homeExisted = await this.PrismaService.home.findUnique({where:{id}})
          if(!homeExisted) throw new NotFoundException("no home found")
          const updatedHome= await this.PrismaService.home.update({where:{id},data:data})
          return new homeResponseDto(updatedHome)
       }

       async getRealtorByHomeId(homeId:number){
        const home= await this.PrismaService.home.findUnique({where:{id:homeId},select:{realtor:true}})
              if(home==undefined) throw new NotFoundException("No home found")
        return home.realtor.id

       }
}
