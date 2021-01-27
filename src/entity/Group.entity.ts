import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './User.entity';
import { Weather } from './Weather.entity';
import { Noise_volume } from './Noise_volume.entity';
import { Groupcomb_music } from './Groupcomb_music.entity';
import { Music_volume } from './Music_volume.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupname: string;

  @ManyToOne((type) => User, (user) => user.groups, { eager: true, cascade :true })
  user: User;
  @Column()
  userId: number;

  @ManyToOne((type) => Weather, (weather) => weather.groups, { eager: true, cascade :true })
  weather: Weather;
  @Column()
  weatherId: number;

  @OneToMany((type) => Noise_volume, (noise_volume) => noise_volume.group) // note: we will create author property in the Photo class below
  noiseVolumes: Noise_volume[];

  @OneToOne((type) => Music_volume) // note: we will create author property in the Photo class below
  musicVolumes: Music_volume[];

  @ManyToOne(
    (type) => Groupcomb_music,
    (groupcomb_music) => groupcomb_music.groups,
    { eager: true, cascade :true },
  )
  groupcombMusic: Groupcomb_music;
  @Column()
  groupcombMusicId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
