import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Group } from './Group.entity';

@Entity()
export class Groupcomb_music {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupcombId: number;

  @Column()
  musicUrl: string;

  @Column({ default: 0 })
  count: number;

  @OneToMany((type) => Group, (group) => group.groupcombMusic) // note: we will create author property in the Photo class below
  groups: Group[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
