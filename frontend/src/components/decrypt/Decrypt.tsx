import { Box, Button, TextField, Grid, Typography, Theme } from "@mui/material";
import React, {useState, useEffect} from 'react'
import kuknosWalletConnect from '@kuknos/wallet-connect'
import {Client as walletConnect} from '@kuknos/wallet-connect'
import {useSelector, shallowEqual, useDispatch} from 'react-redux'
import {v4 as UUID} from 'uuid'
import { RootState } from "../../interfaces/redux.interface";
import CryptoJs, {SHA256} from 'crypto-js'
import { HandleErrors } from "../../utils/HandleErrors";
import { decryptAES, encryptAES } from "../../utils/AesEncryption";
import {getMessageService, saveMessageService} from '../../services/message.service'
import { LoadingButton } from '@mui/lab';
import {toast} from 'react-toastify'
import {isAndroid} from 'react-device-detect' 
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { makeStyles } from '@mui/styles';
import { padding } from "@mui/system";


const styles =  makeStyles((theme: Theme)=>({

    btnBoxIcon:{
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: '50%',
        padding: theme.spacing(0.5, 1.3),
        color: theme.palette.primary.main,
        fontSize: 25,
        "&:hover" :{
            color: theme.palette.primary.main,
        }
    }
}))

function Decrypt(){
    const classes = styles()
    const dispatch = useDispatch();
    const wallet = useSelector<RootState, walletConnect>(state => state.User.walletConnect, shallowEqual)
    const publickey = useSelector<RootState, string>(state => state.User.publickey, shallowEqual)

    const [message, setMessage] = useState('');
    const [messageUUID, setMessageUUID] = useState('');

    const [loading, setLoading] = useState(false)

    const submit = async ()=>{
        try {
            if(!messageUUID){
                toast.error('شناسه پیام را وارد کنید.');
                return;
            }
            setLoading(true)
            const response = await getMessageService(messageUUID);

            const decryptResponse = await wallet.curveDecrypt(response.data.encrypted_secret);
            if(decryptResponse.status === "reject"){
                toast.error("درخواست توسط کاربر لغو شد");
                setLoading(false)
                return;
            }
            const secret = decryptResponse.data.plain_text                        
            const message = decryptAES(response.data.data, secret);
            setMessage(message);
            setLoading(false)
        } catch (error) {                        
            setLoading(false)
            HandleErrors(error)
        }
    }   

    return(
        <Box>
            {!message && <>
                <TextField value={messageUUID} onChange={(e)=>{setMessageUUID(e.target.value)}} label={'شناسه پیام'}  fullWidth  />
                <LoadingButton loading={loading} onClick={submit} sx={{mt: 2}} fullWidth  variant="outlined">
                    رمزگشایی پیام
                </LoadingButton>
            </>}

            {message && <Box sx={{mt: 2}}>
                <Grid container justifyContent={'center'}>
                    <Typography  color={'green'}>پیام شما با موفقیت رمزگشایی شد.</Typography>
                </Grid>
                <Grid sx={{mt: 2}} container justifyContent={'center'}>
                    <Typography variant="caption"  color={'text.primary'}>{message}</Typography>
                </Grid>

                <Grid sx={{mt: 4}} container justifyContent={'center'}>
                    <Button onClick={()=>{
                        setMessageUUID('')
                        setMessage('')
                }}>رمزگشایی پیام جدید</Button>
                </Grid>

            </Box>}
        </Box>
    )
}


export default Decrypt