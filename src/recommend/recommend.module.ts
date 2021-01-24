import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendController } from './recommend.controller';
import { RecommendService } from './recommend.service';
import { Group } from '../entity/Group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group])],
  controllers: [RecommendController],
  providers: [RecommendService],
  exports: [TypeOrmModule],
})
export class RecommendModule {}
