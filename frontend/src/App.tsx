import React, {useState, useEffect} from 'react';
import 'antd/dist/antd.css';
import './App.scss';
import {Client as ConnectWallet, walletType} from '@kuknos/wallet-connect'
import {useSelector, useDispatch, shallowEqual} from 'react-redux'
import { RootState } from './interfaces/redux.interface';
import { ActionTypes } from './redux/actions/tyeps';
import Header from './components/header/Header';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { Box, createTheme, CssBaseline, Grid , Tab, tableBodyClasses, Tabs, TextField, ThemeProvider, Theme} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Encrypt from './components/encrypt/Encrypt';
import { makeStyles } from '@mui/styles';
import Decrypt from './components/decrypt/Decrypt';

function App() {
  
  const dispatch = useDispatch()
  const walletConnect = useSelector<RootState, ConnectWallet>(state => state.User.walletConnect, shallowEqual);


  const [currentTab , setCurrentTab] = useState(0)
  
  useEffect(()=>{
    initWallet()
  },[])

  const initWallet = async ()=>{
    const wallet = new ConnectWallet({})
    wallet.setWalletType(walletType.phone)
    dispatch({
      type: ActionTypes.SET_WALLET_CONNECT,
      payload: wallet
    })
  }


  const lightTheme = createTheme({ 
    typography:{
      fontFamily: 'IRANSans' 
    },
    direction: 'rtl',
    palette:{
      mode: 'light',
      primary: {
        main: '#B95968'
      },
      secondary: {
        main: '#9B3F4D'
      },
      background: {
        default: '#ffffff',
        paper: '#f5f5f5'
      }
    }
  });

  
  const cacheRTL = createCache({
    key: 'kuknos',
    stylisPlugins: [prefixer, rtlPlugin],
  });


  function TabPanel(props: any) {
    const { children, value, index, ...other } = props;
    

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        style={{height: '80%', }}
      >
        {value === index && (
          <Box sx={{ p: 0.5,height: '100%' }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  return (
    <div className="App">
      <CacheProvider value={cacheRTL}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <ToastContainer />
          <Header />


          <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
              <Tabs  value={currentTab} onChange={(e, val)=>{setCurrentTab(val)}}>
                <Tab sx={{width: '50%'}} label={'رمزنگاری پیام'} />
                <Tab sx={{width: '50%'}} label={'رمزگشایی پیام'} />
              </Tabs>
              <TabPanel value={currentTab} index={0}>
                <Box sx={{p: 1, mt: 2}}>
                  <Encrypt />
                </Box>
              </TabPanel>
              <TabPanel value={currentTab} index={1}>
                <Box sx={{p: 1, mt: 2}}>
                  <Decrypt />
                </Box>
              </TabPanel>
          </Box>

        </ThemeProvider>
      </CacheProvider>

    </div>
  );
}

export default App;
