
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacebookStrategy } from './auth/facebook.strategy';
import { NoisesModule } from './noises/noises.module';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';
import { RecommendModule } from './recommend/recommend.module';

@Module({
  imports: [TypeOrmModule.forRoot(), NoisesModule, RecommendModule],
  controllers: [AuthController],
  providers: [FacebookStrategy, UserService],
})
export class AppModule {}
