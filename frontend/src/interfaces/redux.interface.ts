import { ActionTypes } from "./../redux/actions/tyeps";
import { User } from "./user.interface";

export interface Reducer<T>{
    (
        state: T,
        action: Action
    ): T
}

export interface Action{
    type: ActionTypes,
    payload: any
}

export interface RootState {
    User: User,
}
