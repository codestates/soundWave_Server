import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity()
export class Groupcomb_noise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    groupcomb_id: number;

    @Column()
    noise_id: number;
    
    @CreateDateColumn({name: "created_at"})
    createdAt: Date;
}
