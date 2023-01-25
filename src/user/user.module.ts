import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  controllers: [ AuthController],
  providers: [ AuthService],
  imports: [PrismaModule]
})
export class UserModule {}
