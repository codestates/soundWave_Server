import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from './User.entity';
import { Weather } from './Weather.entity';
import { Noise_volume } from './Noise_volume.entity';
import { Groupcomb_music } from './Groupcomb_music.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupname: string;

  @ManyToOne((type) => User, (user) => user.groups, { eager: true })
  user: User;

  @ManyToOne((type) => Weather, (weather) => weather.groups, { eager: true })
  weather: Weather;

  @OneToMany((type) => Noise_volume, (noise_volume) => noise_volume.group) // note: we will create author property in the Photo class below
  noise_volumes: Noise_volume[];

  @ManyToOne(
    (type) => Groupcomb_music,
    (groupcomb_music) => groupcomb_music.groups,
    { eager: true },
  )
  groupcomb_music: Groupcomb_music;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
