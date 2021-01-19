import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity()
export class Weather {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    weather: string;
    
    @CreateDateColumn({name: "created_at"})
    createdAt: Date;
}
