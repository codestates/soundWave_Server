import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { NoisesController } from './noises/noises.controller';
// import { NoisesModule } from './noises/noises.module';
// import { NoisesService } from './noises/noises.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Noise } from '../db/src/entity/Noise.entity';
import { NoisesModule } from './noises/noises.module';
// import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      username: 'root',
      password: '1234',
      database: 'soundwave',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }), NoisesModule],
  // controllers: [NoisesController],
  // providers: [NoisesService],
  // imports: [NoisesModule]
})
export class AppModule {}
