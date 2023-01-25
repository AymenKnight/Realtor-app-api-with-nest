import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { HomeModule } from './home/home.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './user/interceptors/user.interceptor';
import { AuthGuard } from './user/guards/auth.guard';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  controllers: [AppController],
  providers: [AppService,{provide:APP_INTERCEPTOR,useClass:UserInterceptor},{provide:APP_GUARD,useClass:AuthGuard}],
  imports: [UserModule, HomeModule,PrismaModule],
})
export class AppModule {}
