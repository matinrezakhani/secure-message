import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'


@Entity()
export class Message extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @Column({nullable: true, default: null})
    uuid: string

    @Column({nullable: true, default: null})
    data: string

    @Column({nullable: true, default: null})
    signature: string

    @Column({nullable: false , type: 'timestamp'})
    created_at: Date

    @Column({nullable: false , type: 'timestamp'})
    expire_time: Date

    @Column({nullable: false , type: 'timestamp'})
    delete_time: Date
} 