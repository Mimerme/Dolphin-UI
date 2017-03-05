const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const {
  dialog
} = require('electron')

const fs = require("fs");
const template = {
  DolphinExecutable: "",
  LoggedIn: false,
  Session: "",
  PlayerID: "",
  MeleeISO: "",
  Data: "",
  PerformanceScore: 0,
  Hardware: []
}

function writeTemplate() {
  fs.writeFile("config.json", JSON.stringify(template), {
    flag: 'wx'
  });
}


function autoConfig() {
  let response = dialog.showOpenDialog({
    title: "Set the application data directory",
    defaultPath: __dirname,
    properties: ["openDirectory"],
  });
  template.DolphinExecutable = response[0] + "\\dolphincore\\Dolphin.exe"
  template.MeleeISO = response[0] + "\\games\\melee.iso"
  template.Data = response[0];
  writeTemplate();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './views/dev_modules.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })


    //Creates the config.json file
    fs.exists("config.json", function (exists) {
    if (!exists) {
        let response = dialog.showMessageBox({
            title: "Automatic Setup",
            type: "question",
            message: "It seems as though your configuration file is missing. Would you like to run the automated setup?",
            buttons: ["Yes", "No"],
        });

    switch (response) {
      case 0:
        //Ask for data directory
        //Set performance score
        //Get hardware specs
        console.log("Asking for configuration");
        autoConfig();
        break;
      case 1:
        dialog.showMessageBox({
          title: "You sure about that m8?",
          type: "question",
          message: "Without the configuration file there will be a slew of errors. It's expected that you manually configure the application."
        });
        break;
    }

  }
});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.in('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
