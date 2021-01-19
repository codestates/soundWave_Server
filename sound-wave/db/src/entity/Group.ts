import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Music_volume } from './Music_volume';
import { User } from './User';
import { Weather } from './Weather';
import { Noise_volume } from './Noise_volume';
import { Groupcomb_music } from './Groupcomb_music';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupname: string;

  // @Column()
  // users_id: number;
  @ManyToOne((type) => User, (user) => user.groups)
  user: User;

  //   @Column()
  //   groupcomb_music: number;

  // @Column()
  // weathers_id: number;
  @ManyToOne((type) => Weather, (weather) => weather.groups)
  weather: Weather;

  @OneToMany((type) => Noise_volume, (noise_volume) => noise_volume.group) // note: we will create author property in the Photo class below
  noise_volumes: Noise_volume[];

  @ManyToOne(
    (type) => Groupcomb_music,
    (groupcomb_music) => groupcomb_music.groups,
  )
  groupcomb_music: Groupcomb_music;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
