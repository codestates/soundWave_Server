import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

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
    
    @CreateDateColumn({name: "created_at"})
    createdAt: Date;
}
