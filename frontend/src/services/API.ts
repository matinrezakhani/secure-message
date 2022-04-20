import axios, {AxiosInstance} from "axios";
import { User } from "../interfaces/user.interface";
import {store} from './../redux/store/store'

export let backendAPi:AxiosInstance = axios.create();
export let horizonAPi:AxiosInstance = axios.create();

horizonAPi.interceptors.request.use(async (config) => {	
	config.baseURL = (window as any).env.horizon.public;
	return config;
});

backendAPi.interceptors.request.use(async (config) => {
	const user:User = store.getState().User

	config.baseURL = (window as any).env.base_url;
	config.headers = {
		"publickey": user.publickey,
	};
	return config;
});


export const HorizonApi = horizonAPi;
export const BackendApi = backendAPi;
