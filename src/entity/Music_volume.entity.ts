import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Group } from './Group.entity';

@Entity()
export class Music_volume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  musicUrl: string;

  @Column({nullable: true})
  volume: number;

  @OneToOne((type) => Group)
  @JoinColumn()
  group: Group;
  @Column()
  groupId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
