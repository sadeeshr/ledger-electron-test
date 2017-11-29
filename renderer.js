// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.



// function getLedger () {
    const ledger = require('ledgerco');    
    console.log("ledger from renderer process: ", ledger);    
// }

var {ipcRenderer, remote} = require('electron');  
var main = remote.require("./main.js");

setTimeout(() => {
// Send ledger message to main process
console.log("sending to main process");
ipcRenderer.send('ledger', 1);    
}, 2000);

setTimeout(() => {
    // Send ledger message to main process
    console.log("query address to main process");
    ipcRenderer.send('ledger-address', 1);    
    }, 5000);

// Listen for ledger-reply message from main process
ipcRenderer.on('ledger-reply', (event, arg) => {  
    // Print 2
    console.log("ledger from main process: ", arg);    
});

ipcRenderer.on('address-reply', (event, arg) => {  
    // Print 2
    console.log("address from main process: ", arg);    
});