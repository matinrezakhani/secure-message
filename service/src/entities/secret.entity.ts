import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { Message } from './message.entity'


@Entity()
export class Secret extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @ManyToOne(() => Message)
    message: Message

    @Column({nullable: true, default: null})
    publickey: string

    @Column({nullable: true, default: null})
    encrypted_secret: string
    
} 