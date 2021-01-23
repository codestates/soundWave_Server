
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacebookStrategy } from './auth/facebook.strategy';
import { NoisesModule } from './noises/noises.module';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [TypeOrmModule.forRoot(), NoisesModule],
  controllers: [AuthController],
  providers: [FacebookStrategy, UserService],
})
export class AppModule {}
