import { Box, Button, TextField, Grid, Typography, Theme } from "@mui/material";
import React, {useState, useEffect} from 'react'
import kuknosWalletConnect from '@kuknos/wallet-connect'
import {Client as walletConnect} from '@kuknos/wallet-connect'
import {useSelector, shallowEqual, useDispatch} from 'react-redux'
import {v4 as UUID} from 'uuid'
import { RootState } from "../../interfaces/redux.interface";
import CryptoJs, {SHA256} from 'crypto-js'
import { HandleErrors } from "../../utils/HandleErrors";
import { encryptAES } from "../../utils/AesEncryption";
import {getAccountId, saveMessageService} from './../../services/message.service'
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
        padding: theme.spacing(0.2, 1.4),
        color: theme.palette.primary.main,
        fontSize: 25,
        "&:hover" :{
            color: theme.palette.primary.main,
        }
    }
}))




function Encrypt(){
    const classes = styles()
    const dispatch = useDispatch();
    const wallet = useSelector<RootState, walletConnect>(state => state.User.walletConnect, shallowEqual)
    const publickey = useSelector<RootState, string>(state => state.User.publickey, shallowEqual)

    const [to, setTo] = useState('');
    const [message, setMessage] = useState('');
    const [messageUUID, setMessageUUID] = useState('');

    const [loading, setLoading] = useState(false)


    useEffect(()=>{  // check kuknos address
        try {
            if(to.substr(to.length - 10) === '*kuknos.ir'){
                
                getAccountId(to)
                .then((result) => {
                    setTo((result as any).account_id)
                }).catch((err) => {
                    
                });

            }
        } catch (error) {
            
        }
    },[to])

    

    const submit = async ()=>{
        try {
            if(!to){
                toast.error('کلید عمومی یا آدرس ققنوسی گیرنده را وارد کنید');
                return;
            }
            setLoading(true)
            const hash = SHA256(message).toString();
            const secret = UUID()
            const encryptedMessage = encryptAES(message, secret);           
            const ownerEncryptedSecret = await wallet.curveEncrypt({
                plain_text: secret,
                publickey: publickey
            })
            const receiverEncryptedSecret = await wallet.curveEncrypt({
                plain_text: secret,
                publickey: to
            })
            const signResponse = await wallet.signData(hash);
            if(signResponse.status === "reject"){
                toast.error("درخواست توسط کاربر لغو شد");
                setLoading(false)
                return;
            }
            const data = {
                data: encryptedMessage,
                signature: signResponse.data.signature,
                owner_encrypted_secret: ownerEncryptedSecret.data.cipher_text,
                receiver_publickey: to,
                receiver_encrypted_secret: receiverEncryptedSecret.data.cipher_text
            }
            const response = await saveMessageService(data);
            setMessageUUID(response.data.uuid);
            setLoading(false)
        } catch (error) {     
            console.log(error);
            alert(JSON.stringify(error))
            setLoading(false)
            HandleErrors(error)
        }
    }   

    return(
        <Box>
            {!messageUUID && <>
                <TextField value={to} onChange={(e)=>{setTo(e.target.value)}} label={'کلید عمومی یا آدرس ققنوسی گیرنده'}  fullWidth  />
                <TextField value={message} onChange={(e)=>{setMessage(e.target.value)}} sx={{mt: 1}} minRows={5} label={'پیام'}  multiline fullWidth  />
                <LoadingButton loading={loading} onClick={submit} sx={{mt: 2}} fullWidth  variant="outlined">
                    رمزنگاری پیام
                </LoadingButton>
            </>}

            {messageUUID && <Box sx={{mt: 2}}>
                <Grid container justifyContent={'center'}>
                    <Typography  color={'green'}>پیام شما با موفقیت رمزنگاری شد.</Typography>
                </Grid>
                <Grid sx={{mt: 2}} container justifyContent={'center'}>
                    <Typography variant="caption"  color={'green'}>شناسه: {messageUUID}</Typography>
                </Grid>

                <Grid sx={{mt: 6}} container justifyContent={'space-around'}>
                    <Grid display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} item  >
                        <Button sx={{borderRadius: '50%'}}>
                            <a className={classes.btnBoxIcon} href={`https://wa.me/?text=${encodeURIComponent(`${messageUUID}`)}`}><i className="lab la-whatsapp icon"></i></a>
                        </Button>
                        <Typography color={'primary'} variant="body2">واتس آپ</Typography>
                    </Grid>
                    <Grid item display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                        <Button sx={{borderRadius: '50%'}}>
                            {isAndroid && <a className={classes.btnBoxIcon} href={`sms:?body=${encodeURIComponent(`${messageUUID}`)}`}><i className="las la-sms icon"></i></a>}
                            {!isAndroid && <a className={classes.btnBoxIcon} href={`sms:&body=${encodeURIComponent(`${messageUUID}`)}`}><i className="las la-sms icon"></i></a>}
                        </Button>
                        <Typography color={'primary'} variant="body2" >پیامک</Typography>
                    </Grid>
                    <Grid item display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                        <Button sx={{borderRadius: '50%'}}>
                            <CopyToClipboard text={messageUUID} onCopy={()=>{}}>
                                <a className={classes.btnBoxIcon}><i className="las la-copy icon"></i></a>
                            </CopyToClipboard>
                        </Button>
                        <Typography  color={'primary'} variant="body2" >کپی</Typography>
                    </Grid>
                </Grid>
                <Grid sx={{mt: 4}} container justifyContent={'center'}>
                    <Button onClick={()=>{
                        setMessageUUID('')
                        setTo('')
                        setMessage('')
                }}>رمز نگاری پیام جدید</Button>
                </Grid>

            </Box>}
        </Box>
    )
}


export default Encrypt