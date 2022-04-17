import { Router, Request, Response, NextFunction } from "express";
import { Exception, HandleError } from "./../handlesErrors/handleError";
import { IResponse } from "./../interfaces/response.interface";
import { MessageService } from "./../services/message.service";
import * as Moment from 'jalali-moment'
import { apiLimiter } from "./../middlewares/rateLimit";
import { checkPublickey } from "./../middlewares/checkPublickey";
import { SecretService } from "./../services/secret.service";




export class MessageController{
    public path: String = "/message";
	public router = Router();

    private messageService: MessageService
    private secretService: SecretService;

    constructor(){
        this.intialRouts();

        this.secretService = new SecretService()
        this.messageService = new MessageService()
    }

    private intialRouts(){
        this.router.post('/', apiLimiter, checkPublickey, (req, res)=>{this.newMessage(req, res)})
        this.router.get('/', apiLimiter, checkPublickey,  (req, res)=>{this.getMessage(req, res)})
    }

    public async newMessage(req: Request, res: Response){
        try {
            const publickey: string = req.headers.publickey as string
            const {
                data,
                signature,
                owner_encrypted_secret,
                receiver_publickey,
                receiver_encrypted_secret
            } = req.body;

            const message = await this.messageService.createMessage(data, signature);
            const ownerSecret = await this.secretService.createSecret(message, publickey, owner_encrypted_secret);
            const receiverSecret = await this.secretService.createSecret(message, receiver_publickey, receiver_encrypted_secret);

            const response: IResponse = {
                success: true,
                message: '',
                data: {
                    uuid: message.uuid
                }
            }
            res.status(200).json(response)

        } catch (error) {
            HandleError(res, error)
        }
    }

    public async getMessage(req: Request, res: Response){
        try {            
            const uuid: string = req.query.uuid as string
            const message = await this.messageService.findByUUID(uuid);
            const publickey: string = req.headers.publickey as string

            if(!message){
                const response: IResponse = {
                    success: false,
                    message: 'پیامی با این مشخصات وجود ندارد',
                    data: null
                }
                res.status(400).json(response)
                return;
            }

            if(Moment(message.expire_time).isBefore(Moment())){
                const response: IResponse = {
                    success: false,
                    message: 'اعتبار پیام گذشته است',
                    data: null
                }
                res.status(400).json(response)
                return;
            }

            const secret = await this.secretService.findByPublickeyAndMessage(publickey, message);
            if(!secret){
                const response: IResponse = {
                    success: false,
                    message: 'پیامی با این مشخصات وجود ندارد',
                    data: null
                }
                res.status(400).json(response)
                return;
            }
            
            const response: IResponse = {
                success: true,
                message: '',
                data: {
                    data: message.data,
                    signature: message.signature,
                    encrypted_secret: secret.encrypted_secret
                }
            }
            res.status(200).json(response)

        } catch (error) {
            HandleError(res, error)
        }
    }


}