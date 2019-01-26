const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const fs = require('fs')

app.commandLine.appendSwitch('touch-events', 'enabled');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow();
  mainWindow.maximize();

  mainWindow.setFullScreen(true);
  // mainWindow.setFullScreen(false);
  mainWindow.setMenu(null);

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'selectors.html'),
    // pathname: path.join(__dirname, 'OEBPS/multiboard/index_1nen.xhtml'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
