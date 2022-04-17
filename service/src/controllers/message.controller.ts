import { Router, Request, Response, NextFunction } from "express";
import { Exception, HandleError } from "./../handlesErrors/handleError";
import { IResponse } from "./../interfaces/response.interface";
import { MessageService } from "./../services/message.service";
import * as Moment from 'jalali-moment'
import { apiLimiter } from "./../middlewares/rateLimit";




export class MessageController{
    public path: String = "/message";
	public router = Router();

    private messageService: MessageService

    constructor(){
        this.intialRouts();

        this.messageService = new MessageService()
    }

    private intialRouts(){
        this.router.post('/', apiLimiter, (req, res)=>{this.newMessage(req, res)})
        this.router.get('/', apiLimiter,  (req, res)=>{this.getMessage(req, res)})
    }

    public async newMessage(req: Request, res: Response){
        try {
            const {data, signature} = req.body;

            const message = await this.messageService.createMessage(data, signature);

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
            
            const response: IResponse = {
                success: true,
                message: '',
                data: message
            }
            res.status(200).json(response)

        } catch (error) {
            HandleError(res, error)
        }
    }


}