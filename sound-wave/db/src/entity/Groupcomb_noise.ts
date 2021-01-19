import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Noise } from './Noise';

@Entity()
export class Groupcomb_noise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupcomb_id: number;

  //   @Column()
  //   noise_id: number;

  @ManyToOne((type) => Noise, (noise) => noise.groupcomb_noises)
  noise: Noise;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
