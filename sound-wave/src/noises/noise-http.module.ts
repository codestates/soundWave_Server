import { Module } from '@nestjs/common';
import { NoisesController } from './noises.controller';
import { NoisesModule } from './noises.module';
import { NoisesService } from './noises.service';

@Module({
    imports: [NoisesModule],
    providers: [NoisesService],
    controllers: [NoisesController]
  })
  export class NoiseHttpModule {}
  