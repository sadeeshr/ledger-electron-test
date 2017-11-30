const electron = require('electron')
const ledger = require('ledgerco')

// Module to control application life.
// const app = electron.app
// Module to create native browser window.
// const BrowserWindow = electron.BrowserWindow
var { app, BrowserWindow, ipcMain } = electron;


const path = require('path')
const url = require('url')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

var ledgercomm
var eth

function createWindow() {

  setTimeout(() => {
    ledger.comm_node.list_async().then((deviceList) => {
      connected = deviceList.length > 0
      console.log("Connected: ", deviceList);
      ledger.comm_node.create_async().then((comm) => {
        ledgercomm = comm
        console.log("LedgerComm: ", ledgercomm);
        eth = new ledger.eth(ledgercomm);
        console.log("ETH: ", eth);
        let ethBip32 = "44'/60'/0'/";
        
        for (let i = 0; i < 5; i++) {
          eth.getAddress_async(ethBip32 + 0)
            .then(
            function (result) {
              console.log("RESULT : ", result);
              // event.sender.send('address', result);
            })
            .catch(
            function (error) {
              console.log("ERROR is: ", error);
            });
        }
      }).fail((error) => console.log(error))
    })
  }, 1000);

  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

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


ipcMain.on('ledger', (event, arg) => {
  if (arg.action == 'getAddress') {
    let ethBip32 = "44'/60'/0'/";

    for (let i = 0; i < 5; i++) {
      eth.getAddress_async(ethBip32 + 0)
        .then(
        function (result) {
          console.log("RESULT : ", result);
          event.sender.send('address', result);
        })
        .catch(
        function (error) {
          console.log("ERROR is: ", error);
        });
    }
  }
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
