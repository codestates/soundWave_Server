import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity()
export class Noise_volume {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    group_id: number;

    @Column()
    noise_id: number;

    @Column()
    volume: number;
    
    @CreateDateColumn({name: "created_at"})
    createdAt: Date;
}
