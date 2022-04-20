import axios from "axios";
import { GetMessage, SaveMessage } from "../interfaces/message.interface";
import { IResponse } from "../interfaces/response.interface";
import { backendAPi } from "./API"

export function getAccountId(id: string):Promise<IResponse<SaveMessage>>{
    return new Promise((resolve , reject)=>{
        axios.get(`${(window as any).env.federation_url}`, {
            params:{
                q: id,
                type: 'name'
            }
        })
        .then((result) => {
            resolve(result.data)
        }).catch((err) => {
            reject(err)
        });
    })
}

export function saveMessageService(data: any):Promise<IResponse<SaveMessage>>{
    return new Promise((resolve , reject)=>{
        backendAPi.post('/message', data)
        .then((result) => {
            resolve(result.data)
        }).catch((err) => {
            reject(err)
        });
    })
}

export function getMessageService(uuid: string):Promise<IResponse<GetMessage>>{
    return new Promise((resolve , reject)=>{
        backendAPi.get('/message', {
            params: {
                uuid
            }
        })
        .then((result) => {
            resolve(result.data)
        }).catch((err) => {
            reject(err)
        });
    })
}