import { group } from 'console';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Group } from './Group.entity';
import { Noise } from './Noise.entity';

@Entity()
export class Noise_volume {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // noise_id: number;

  @Column()
  volume: number;

  @ManyToOne((type) => Group, (group) => group.noiseVolumes)
  @JoinColumn()
  group: Group;

  @ManyToOne((type) => Noise, (noise) => noise.noiseVolumes)
  @JoinColumn()
  noise: Noise;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
