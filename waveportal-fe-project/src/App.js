import React, {useState} from "react";
import { ethers } from "ethers";
import './App.css';
import abiFile from "./utils/WavePortal.json"

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [totalWaves, setTotalWaves] = useState(0);

  const [message, setMessage] = useState("");

  const contractAddress = "0xb5A88E80883fB1008c645EFfC9380757124670cB";
  const contractABI = abiFile.abi;

  const checkWallet = async () => {
    try{
      const {ethereum} = window;
        if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
        } else {
          console.log("We have the ethereum object", ethereum);
        }

        const provide = new ethers.providers.Web3Provider(ethereum);
        const signer = provide.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer)

        let count = await contract.getTotalWaves();
        setTotalWaves(count.toNumber());

        let allWaves = await contract.getAllWaves();
        console.log("allWaves", allWaves);
        
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        console.log("Accounts", accounts);
        if(accounts.length != 0){
          const account = accounts[0];
          setCurrentAccount(account);
        }
        else{
          console.log("No accounts detected");
        }
    }
    catch(err){
      console.log("Error: ", err);
    }
  }

  const wave = async () =>  {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provide = new ethers.providers.Web3Provider(ethereum);
        const signer = provide.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer)

        console.log("Signer: ", signer, "Provider: ", provide);
        let count = await contract.getTotalWaves();

        const waveTxn = await contract.wave(message);
        
        
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined!", waveTxn.hash);

        count = await contract.getTotalWaves();
        console.log("Total Waves: ", count);
        setTotalWaves(count.toNumber());

        await waveTxn.wait();


        console.log("Retrieved total wave count...", count.toNumber());
}
    }
    catch(err){
      console.log("Error: ", err);
    }

  }

  const connectWallet = async () => {
    try{
      const {ethereum} = window;
        if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
        } else {

          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          console.log("Accounts", accounts);
          setCurrentAccount(accounts[0]);
    }
  }
  catch(err){
    console.log("Error: ", err);
  }
  }

  const getAllWaves = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provide = new ethers.providers.Web3Provider(ethereum);
        const signer = provide.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.map((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          }
        )})

        setAllWaves(wavesCleaned);
      }
      else{
        console.log("No ethereum detected");
      }
    }
    catch(err){
      console.log("Error: ", err);
    }
  }

  React.useEffect(() => {
    checkWallet();
    let wavePortalContract;

    //Function to be called on newWave event.
    const onNewWave = (from , timestamp, message) => {
      console.log("New wave: ", from, timestamp, message);
      setAllWaves([...allWaves, {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      }]);
    }

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      //Event listener for event defined in contract.
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, [])
  
  return (
    <>
    <div className="page">
    <div className="total_waves">
        👋 - {totalWaves}
      </div>
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          Welcome to Wave Portal!
        </div>

        <div className="bio">
          So now that you're here,
          <div>
          Connect your metamask account to the portal and wave at me!
          </div>
          <br></br>
          <div>
            See you Space Cowboy...
          </div>
        </div>

        <input class="effect-9" type="text" placeholder="Leave a message" onChange={(e) => setMessage(e.target.value)}/>
        <span class="focus-border">
          <i></i>
          </span>
        <div className="btn-wrapper">
        <button className="btn btn-white" onClick={wave}>
          Wave at Me
        </button>
        <div className="input_field">
        
        </div>

        { !currentAccount ? (
          <>
            <button className="btn btn-white" onClick={connectWallet}>
              Connect your wallet!
            </button>
        </>
        ) : (
          <></>
        )}

        </div>
      </div>
    </div>
    </div>
    </>
  );
}
