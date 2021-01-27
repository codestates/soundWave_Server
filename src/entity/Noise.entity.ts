import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Groupcomb_noise } from './Groupcomb_noise.entity';
import { Noise_volume } from './Noise_volume.entity';

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
  groupcombNoises: Groupcomb_noise[];

  @OneToMany((type) => Noise_volume, (noise_volume) => noise_volume.noise) // note: we will create author property in the Photo class below
  noiseVolumes: Noise_volume[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
