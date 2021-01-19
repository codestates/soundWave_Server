import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne} from "typeorm";
import {User} from "./User";

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    groupname: string;

    // @Column()
    // users_id: number;
    @ManyToOne(type => User, user => user.groups)
    user: User;

    @Column()
    groupcomb_music: number;

    @Column()
    weathers_id: number;
    
    @CreateDateColumn({name: "created_at"})
    createdAt: Date;
}
