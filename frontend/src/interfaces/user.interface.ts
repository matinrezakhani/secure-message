import * as WalletConnect from '@kuknos/wallet-connect'

export interface User{
    accessToken: string;
    publickey: string;
    walletConnect: WalletConnect.Client
}

