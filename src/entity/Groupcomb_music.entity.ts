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
  groupcomb_id: number;

  @Column()
  music_url: string;

  @Column()
  count: number;

  @OneToMany((type) => Group, (group) => group.groupcomb_music) // note: we will create author property in the Photo class below
  groups: Group[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
