import { group } from 'console';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Group } from './Group.entity';

@Entity()
export class Noise_volume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  noise_id: number;

  @Column()
  volume: number;

  @ManyToOne((type) => Group, (group) => group.noise_volumes)
  group: Group;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}