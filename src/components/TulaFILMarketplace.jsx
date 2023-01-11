import React, { useState, useEffect } from 'react';
import TulaFIL from '../contracts/TulaFIL.json';
import { useWeb3 } from '../web3/useWeb3';

function TulaFILMarketplace() {
  const [storageProviders, setStorageProviders] = useState([]);
  const [storage, setStorage] = useState(0);
  const [provider, setProvider] = useState(null);
  const [cid, setCid] = useState(null);
  const [balance, setBalance] = useState(0);
  const { web3 } = useWeb3();

  useEffect(() => {
    // Fetch all the providers
    // fetchProviders();
  }, [web3]);

  const fetchProviders = async () => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = TulaFIL.networks[networkId];
    const instance = new web3.eth.Contract(
      TulaFIL.abi,
      deployedNetwork && deployedNetwork.address,
    );
    // get all the providers
    const providers = await instance.methods.getProviders().call();
    setStorageProviders(providers);
  };

  const handleSelectProvider = (event) => {
    setProvider(event.target.value);
  };

  const handleStorageChange = (event) => {
    setStorage(event.target.value);
  };

  const handleRentStorage = async () => {
    if (!web3 || !provider || !storage) {
      alert('Please select a provider and enter the storage amount.');
      return;
    }
    // calculate the cost
    const totalCost = await instance.methods
      .calculateTotalCost(provider, storage)
      .call();

    if (balance < totalCost) {
      alert('Insufficient balance.');
      return;
    }

    // Rent the storage
    try {
      const cid = await instance.methods.rentStorage(provider, storage, 'some-data').send({
        from: accounts[0],
        value: totalCost,
      });
      setCid(cid);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleRetrieveData = async () => {
    if (!cid) {
      alert('Please rent storage before retrieving data.');
      return;
    }
    try {
      const data = await instance.methods.retrieveData(cid).call();
      console.log(data);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h1>TulaFIL Marketplace</h1>
      <div>
        <label htmlFor="provider">Select a Provider:</label>
        <select
          id="provider"
          onChange={handleSelectProvider}
        >
          {storageProviders.map((provider) => (
            <option key={provider.address} value={provider.address}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="storage">Storage (in GB):</label>
        <input
          type="number"
          id="storage"
          onChange={handleStorageChange}
        />
      </div>
      <button onClick={handleRentStorage}>Rent Storage</button>
      {cid && (
        <>
          <p>Data CID: {cid}</p>
          <button onClick={handleRetrieveData}>Retrieve Data</button>
        </>
      )}
    </div>
  );
}
export default TulaFILMarketplace;
