import { Message } from "../entities/message.entity";
import { Secret } from "../entities/secret.entity";
import { getRepository } from "typeorm";

export class SecretService{
    private secretRepository = getRepository(Secret);

    constructor(){

    }


    public async createSecret(message: Message, publickey: string , encryptedSecret: string): Promise<Secret>{
        let secret: Secret = new Secret();
        secret.message = message;
        secret.encrypted_secret = encryptedSecret;
        secret.publickey = publickey
        await secret.save();
        return secret;
    }

    public async findById(id: number): Promise<Secret | null>{
        const secret = await this.secretRepository.findOne({id: id});
        return secret
    }

    public async findByPublickeyAndMessage(publickey: string, messgae: Message): Promise<Secret | null>{
        const secret = await this.secretRepository.findOne({publickey: publickey, message: messgae});
        return secret
    }

    public async delete(id: number){
        await this.secretRepository.delete({id: id});
    }


}