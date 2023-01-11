import React, { useState } from 'react';
import { useWeb3 } from '../web3/useWeb3';

function FileUploader() {
  const [file, setFile] = useState(null);
  const { web3, accounts } = useWeb3();

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!web3 || !file) {
      alert('Please select a file.');
      return;
    }
    try {
      // convert the file to a buffer
      const buffer = await new Response(file).arrayBuffer();

      // get the cid of the file
      const cid = await IPFS.add(buffer);
      console.log('CID:', cid);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>File Uploader</h2>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
export default FileUploader;
