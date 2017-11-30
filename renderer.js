// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var {ipcRenderer, remote} = require('electron');  

console.log("LIST OF ETHEREUM ADDRESSES: ");
console.log("=============================");

setTimeout(() => {
    ipcRenderer.send('ledger', {
        action: 'getAddress'
      });
}, 2000);
// Listen for ledger device addresses message from main process
ipcRenderer.on('address', (event, arg) => {  
    console.log("Ledger Device ETH Address from main process: ", arg);    
});