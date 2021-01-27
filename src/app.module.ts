import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacebookStrategy } from './auth/facebook.strategy';
import { NoisesModule } from './noises/noises.module';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';
import { RecommendModule } from './recommend/recommend.module';
import { GroupsModule } from './groups/groups.module';
import { AuthService } from './auth/auth.service';
import { GoogleStrategy } from './auth/google.strategy';

@Module({
  imports: [TypeOrmModule.forRoot(), NoisesModule, RecommendModule, GroupsModule],
  controllers: [AuthController],
  providers: [FacebookStrategy, GoogleStrategy, UserService, AuthService],
})
export class AppModule {}
