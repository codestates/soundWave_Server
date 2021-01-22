import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Groupcomb_noise } from './Groupcomb_noise.entity';

@Entity()
export class Noise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @OneToMany(
    (type) => Groupcomb_noise,
    (groupcomb_noise) => groupcomb_noise.noise,
  ) // note: we will create author property in the Photo class below
  groupcomb_noises: Groupcomb_noise[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
