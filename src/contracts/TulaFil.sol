// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "filecoinMockAPIs/MinerAPI.sol";
import "filecoinMockAPIs/MarketAPI.sol";

contract TulaFIL {
    // mapping of storage providers
    mapping(address => Provider) public providers;

    // struct for storage providers
    struct Provider {
        string name;
        uint256 storageCapacity;
        uint256 price;
    }

    // event for storage providers
    event ProviderAdded(address provider, string name, uint256 storageCapacity, uint256 price);

    // function to add a new storage provider
    function addProvider(
        string memory _name,
        uint256 _storageCapacity,
        uint256 _price
    ) public {
        // add the new provider to the mapping
        providers[msg.sender] = Provider(_name, _storageCapacity, _price);

        // emit the ProviderAdded event
        emit ProviderAdded(msg.sender, _name, _storageCapacity, _price);
    }

    // function to add a new storage provider
    function addProvider(
        string memory _name,
        uint256 _storageCapacity,
        uint256 _price
    ) public {
        // check if the sender is a storage miner
        require(LotusAPI.isMiner(msg.sender), "Sender is not a storage miner");
        // create a storage deal
        (LotusAPI.response storageDeal, uint256 _dealID) = LotusAPI.createStorageDeal(
            _storageCapacity,
            1,
            msg.sender
        );
        require(storageDeal.Ok, "Failed to create storage deal: " + storageDeal.Err);
        // add the new provider to the mapping
        providers[msg.sender] = Provider(_name, _storageCapacity, _price, storageDeal.Ok.DealID);

        // emit the ProviderAdded event
        emit ProviderAdded(msg.sender, _name, _storageCapacity, _price, storageDeal.Ok.DealID);
    }

    function rentStorage(address _provider, uint _storage, bytes memory _data) public payable {
        // check if the provider exists
        require(providers[_provider].storageCapacity > 0, "Provider does not exist.");
        // check if the provider has enough storage capacity
        require(providers[_provider].storageCapacity >= _storage, "Provider does not have enough storage capacity.");
        // check if the sender has enough FIL to rent the storage
        require(msg.value >= _storage * providers[_provider].price, "Sender does not have enough FIL.");

        // encrypt data before uploading
        bytes memory encryptedData = AES256Encryption(_data);
        
        // call the Filecoin API to retrieve the storage deal address 
        (LotusAPI.response storageDeal, uint _dealID) = LotusAPI.getStorageDeal(providers[_provider].storageDealAddress);

        // upload data to the storage deal
        (LotusAPI.response uploadData, bytes32 _cid) = LotusAPI.pushDataToDeal(storageDeal.Ok.DealID, encryptedData);
        require(uploadData.Ok, "Failed to upload data: " + uploadData.Err);
        
        // store the CID of the uploaded data in mapping
        mapping(address => mapping(bytes32 => bool)) public dealDataCIDs;
        dealDataCIDs[msg.sender][_cid] = true;

        // transfer FIL to the provider
        _provider.transfer(msg.value);

        // update the provider's storage capacity
        providers[_provider].storageCapacity -= _storage;
        // emit event
        emit StorageRented(msg.sender, _provider, _storage, _data, _cid);
    }
}
