import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Group } from './Group';

@Entity()
export class Music_volume {
  @PrimaryGeneratedColumn()
  id: number;

  //   @Column()
  //   group_id: number;

  @Column()
  music_url: string;

  @Column()
  volume: number;

  @OneToOne((type) => Group)
  @JoinColumn()
  group: Group;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
