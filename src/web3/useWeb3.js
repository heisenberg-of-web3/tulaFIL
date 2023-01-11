import { useState, useEffect } from 'react';
import Web3 from 'web3';

const useWeb3 = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      // Check if the browser has web3 enabled
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          const accounts = await web3.eth.getAccounts();
          setWeb3(web3);
          setAccounts(accounts);
        } catch (error) {
          console.log(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = new Web3(window.web3.currentProvider);
        const accounts = await web3.eth.getAccounts();
        setWeb3(web3);
        setAccounts(accounts);
      }
    };
    initWeb3();
  }, []);

  return { web3, accounts };
};

export { useWeb3 };