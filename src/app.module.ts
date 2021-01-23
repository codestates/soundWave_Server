import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoisesModule } from './noises/noises.module';

@Module({
  imports: [TypeOrmModule.forRoot(), NoisesModule],
})
export class AppModule {}
