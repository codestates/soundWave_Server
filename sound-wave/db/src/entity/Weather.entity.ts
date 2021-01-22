import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Group } from './Group.entity';

@Entity()
export class Weather {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  weather: string;

  @OneToMany((type) => Group, (group) => group.weather) // note: we will create author property in the Photo class below
  groups: Group[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
