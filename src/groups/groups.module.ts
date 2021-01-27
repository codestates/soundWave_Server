import { Module } from '@nestjs/common';
import { Group } from 'src/entity/Group.entity';
import { GroupsService } from './groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsController } from './groups.controller';
import { Noise } from 'src/entity/Noise.entity';
import { Groupcomb_noise } from 'src/entity/Groupcomb_noise.entity';
import { Groupcomb_music } from 'src/entity/Groupcomb_music.entity';
import { Weather } from 'src/entity/Weather.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Noise, Groupcomb_noise, Groupcomb_music, Weather])],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [TypeOrmModule],
})
export class GroupsModule {}
