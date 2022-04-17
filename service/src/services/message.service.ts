import { Message } from "./../entities/message.entity";
import { getRepository } from "typeorm";
import {v4 as UUID} from 'uuid'

export class MessageService{
    private messageRepository = getRepository(Message);

    constructor(){

    }


    public async createMessage(messageText: string, signature: string = null): Promise<Message>{
        let message: Message = new Message();
        message.uuid = UUID();
        message.data = messageText;
        message.signature = signature;
        message.created_at = new Date();

        await message.save();
        return message;
    }

    public async findById(id: number): Promise<Message | null>{
        const message = await this.messageRepository.findOne({id: id});
        return message
    }

    public async findByUUID(uuid: string): Promise<Message | null>{
        const message = await this.messageRepository.findOne({uuid: uuid});
        return message
    }

    public async delete(uuid: string){
        await this.messageRepository.delete({uuid: uuid});
    }


}