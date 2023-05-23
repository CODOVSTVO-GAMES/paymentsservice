import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    price: number
}