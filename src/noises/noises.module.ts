import { Module } from '@nestjs/common';
import { NoisesController } from './noises.controller';
import { NoisesService } from './noises.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Noise } from '../entity/Noise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Noise])],
  controllers: [NoisesController],
  providers: [NoisesService],
  exports: [TypeOrmModule],
})
export class NoisesModule {}
