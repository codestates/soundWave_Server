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

  @Column()
  volume: number;

  @ManyToOne((type) => Group, (group) => group.noiseVolumes)
  group: Group;
  @Column()
  groupId: number;

  @ManyToOne((type) => Noise, (noise) => noise.noiseVolumes)
  noise: Noise;
  @Column()
  noiseId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
