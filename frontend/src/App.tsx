import React, {useState, useEffect} from 'react';
import {ConfigProvider} from 'antd';
import 'antd/dist/antd.css';
import './App.scss';
import {Client as ConnectWallet} from '@kuknos/wallet-connect'


function App() {

  const [wallet, setWallet] = useState<ConnectWallet>({} as ConnectWallet);
  const [publickey, setPublickey] = useState<string>('')
  const [walletConnectLink, setWalletConnectLink] = useState<string>('')

  useEffect(()=>{
    initWallet()
  },[])

  const initWallet = async ()=>{
    const wallet = new ConnectWallet({})
    setWallet(wallet);
    setWalletConnectLink(wallet.getWalletConnectLink())
    const connectResponse = await wallet.connect();
    if(connectResponse.status){
      setPublickey(connectResponse.data.public)
    }
  }

  console.log(walletConnectLink);
  

  return (
    <div className="App">
      <ConfigProvider direction='rtl'>

      </ConfigProvider>
    </div>
  );
}

export default App;
