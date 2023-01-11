import React from 'react';
import { useWeb3 } from './web3/useWeb3';
import TulaFILMarketplace from './components/TulaFILMarketplace';
import FileUploader from './components/FileUploader';

function App() {
  const { web3 } = useWeb3();

  return (
    <div>
      {web3 ? (
        <>
          <TulaFILMarketplace />
          <FileUploader />
        </>
      ) : (
        <p>Please install MetaMask and connect to the Ethereum Network</p>
      )}
    </div>
  );
}

export default App;