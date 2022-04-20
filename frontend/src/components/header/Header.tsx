import React, { useEffect, useState } from 'react';
import {useSelector, shallowEqual, useDispatch} from 'react-redux'
import { RootState } from '../../interfaces/redux.interface';
import {Client as walletConnect} from '@kuknos/wallet-connect'
import Qrcode from 'qrcode.react'
import {makeStyles} from '@mui/styles'
import kuknosWalletConnect from '@kuknos/wallet-connect'
import { Box, Button, Grid, Theme, Typography } from '@mui/material';
import { ActionTypes } from '../../redux/actions/tyeps';
import { HandleErrors } from '../../utils/HandleErrors';

const useStyles = makeStyles((theme: Theme)=>({
    container:{
        backgroundColor: theme.palette.secondary.light,
        padding: theme.spacing(0.8, 2),
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    }
}))



function Header(){
    const classes = useStyles();
    const dispatch = useDispatch();
    const wallet = useSelector<RootState, walletConnect>(state => state.User.walletConnect, shallowEqual)
    const publickey = useSelector<RootState, string>(state => state.User.publickey, shallowEqual)

    const [walletConnectLink, setWalletConnectLink] = useState('');
    const [connectModal, setConnectModal] = useState(false)

    useEffect(()=>{
        if(wallet.getWalletConnectLink){
            setWalletConnectLink(wallet.getWalletConnectLink());
            connectWallet()
        }
    },[wallet])

    
    const connectWallet = async ()=>{
        try {
            const connectResponse = await wallet.connect();
            dispatch({
                type: ActionTypes.SET_PUBLICKEY,
                payload: connectResponse.data.public
            })            
        } catch (error) {
            HandleErrors(error)            
        }
    }


    return(
        <div >
            <Box className={classes.container}>
                <Grid container justifyContent={'center'}>
                    <Grid item>
                        <Typography sx={{color: '#fff', fontSize: 16}}>{publickey.substr(0, 5)} ***** {publickey.substr(-5)}</Typography>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}


export default Header;