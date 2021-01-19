import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity()
export class Noise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    noise_name: string;

    @Column()
    url: string;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;
}