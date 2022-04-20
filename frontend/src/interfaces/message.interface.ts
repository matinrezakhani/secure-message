export interface SaveMessage{
    uuid: string
}

export interface GetMessage{
    data: string,
    signature: string,
    encrypted_secret: string
}