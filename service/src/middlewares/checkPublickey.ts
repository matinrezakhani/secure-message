import {Request , Response ,  NextFunction } from 'express';
import { Exception, HandleError } from './../handlesErrors/handleError';

export function checkPublickey(req : Request , res : Response , next:NextFunction){
    try {
        const lang = req.headers['publickey'];
        if(!lang){
            throw new Exception(400, 'سربرگ publickey وجود ندارد')
        }
        next();
    } catch (error) {
        HandleError(res, error)
    }
}