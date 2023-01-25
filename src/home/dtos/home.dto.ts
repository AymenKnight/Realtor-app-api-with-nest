import { PropertyType } from "@prisma/client"
import { Type } from "class-transformer"
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator"


export class homeResponseDto {

  constructor(partial :Partial<homeResponseDto>){
    Object.assign(this, partial)
  }

       id :number
    address :string
    number_of_bedrooms :number
    number_of_bathrooms :number
    city :string
    listed_date :Date
    price :number
    land_size :number
    propertyType  :PropertyType
  createdAt :Date
   updatedAt :Date
   realtor_id :number
   image:string
}

class Image {
     @IsString()
  @IsNotEmpty()
  url:string
}

export class createHome {
   @IsString()
  @IsNotEmpty()
    address :string
  @IsNumber()
  @IsPositive()
    number_of_bedrooms :number
  @IsNumber()
  @IsPositive()  
    number_of_bathrooms :number
     @IsString()
  @IsNotEmpty()
    city :string
   @IsNumber()
  @IsPositive() 
    price :number
   @IsNumber()
  @IsPositive() 
    land_size :number
    @IsEnum(PropertyType)
    propertyType  :PropertyType
    @IsArray()
    @ValidateNested({each:true})
    @Type(() => Image)
    images :Image[]

}
export class updateHomeDto {
  @IsOptional()
   @IsString()
  @IsNotEmpty()
    address? :string
  @IsOptional()
  @IsNumber()
  @IsPositive()
    number_of_bedrooms? :number
   @IsOptional()  
  @IsNumber()
  @IsPositive()  
    number_of_bathrooms? :number
     @IsOptional()
     @IsString()
  @IsNotEmpty()
    city? :string
     @IsOptional()
   @IsNumber()
  @IsPositive() 
    price? :number
     @IsOptional()
   @IsNumber()
  @IsPositive() 
    land_size? :number
     @IsOptional()
    @IsEnum(PropertyType)
    propertyType?  :PropertyType
 

}
export class inquireDto {
   @IsString()
  @IsNotEmpty()
  messageText :string
}