import { Action, Reducer } from "../../interfaces/redux.interface";
import { User } from "../../interfaces/user.interface";
import { ActionTypes } from "../actions/tyeps";
import * as WalletConnect from '@kuknos/wallet-connect'


export const initialState:User = {
    accessToken: localStorage.getItem('accessToken') || '',
    publickey: localStorage.getItem('publickey') || '',
    walletConnect: {} as WalletConnect.Client
}


export const userReducer: Reducer<User> = (state:User = initialState, action:Action)=>{
    const {type, payload} = action
    switch (type) {

        case ActionTypes.LOGOUT:
            localStorage.removeItem('publickey')
            localStorage.removeItem('accessToken')
            return{
                ...state,
                accessToken: '',
                publickey: '',
            }

        case ActionTypes.SET_PUBLICKEY:
            localStorage.setItem('publickey', payload)
            return{
                ...state,
                publickey: payload
            }

        case ActionTypes.SET_WALLET_CONNECT:{
            return{
                ...state,
                walletConnect: payload
            }
        }
        case ActionTypes.SET_ACCESS_TOKEN:{
            localStorage.setItem('accessToken', payload)
            return{
                ...state,
                accessToken: payload
            }
        }
        default:
            return state;
    }
}