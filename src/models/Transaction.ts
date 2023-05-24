import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number

    @Column()
    transactionId: string

    @Column()
    callId: string

    @Column()
    userId: string

    @Column()
    transactionTimeOK: string

    @Column()
    price: number

    @Column()
    productId: string

    @Column()
    createDate: number
}