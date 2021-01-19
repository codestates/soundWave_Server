import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity()
export class Music_volume {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    group_id: number;

    @Column()
    music_url: string;

    @Column()
    volume: number;
    
    @CreateDateColumn({name: "created_at"})
    createdAt: Date;
}
