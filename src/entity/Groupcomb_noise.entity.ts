import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Noise } from './Noise.entity';

@Entity()
export class Groupcomb_noise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  groupcombId: number;

  @ManyToOne((type) => Noise, (noise) => noise.groupcombNoises)
  noise: Noise;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
