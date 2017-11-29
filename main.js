const electron = require('electron')
// Module to control application life.
// const app = electron.app
// Module to create native browser window.
// const BrowserWindow = electron.BrowserWindow
var {app, BrowserWindow, ipcMain} = electron;  


const path = require('path')
const url = require('url')

const ledger = require('ledgerco')

let comm;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {

 console.log("Ledger: ",ledger);
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Listen for ledger message from renderer process
ipcMain.on('ledger', (event, arg) => {  
  // Print 1
  console.log("received request");
  
  console.log("Ledger request: ", ledger);
  ledger
  .comm_node
  .create_async()
  .then(function(comm) {
    var devices = comm.device.getDeviceInfo();
          console.log(devices);
          comm = comm;
              // Reply on ledger message from renderer process
  event.sender.send('ledger-reply', JSON.stringify(devices));
  })
  .catch(function(reason) {
          console.log('An error occured: ', reason);
  });


});


// Listen for ledger message from renderer process
ipcMain.on('ledger-address', (event, arg) => {  
  console.log("LIST OF ETHEREUM ADDRESSES: ");
  console.log("=============================");

  ledger
  .comm_node
  .create_async()
  .then(function(comm) {
    var devices = comm.device.getDeviceInfo();
          console.log("COMM: ", comm);
          var eth = new ledger.eth(comm);
          console.log(eth);
          let ethBip32 = "44'/60'/0'/";
          for (let i = 0; i < 5; i++) {
              eth.getAddress_async(ethBip32 + i).then(
                  function (result) {
                    var address = i + ". BIP32: " + ethBip32 + "  Address: " + result.address;
                      console.log(address);              
                      event.sender.send('address-reply', JSON.stringify(devices));
                  }).fail(
                  function (error) {
                      console.log(error);             
                  });
                }
              
  })
  .catch(function(reason) {
          console.log('An error occured: ', reason);
  });

  
      
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
