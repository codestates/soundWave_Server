import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Group } from './Group.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  oauth: string;

  @Column({ nullable: true })
  profile: string;

  @OneToMany((type) => Group, (group) => group.user) // note: we will create author property in the Photo class below
  groups: Group[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
