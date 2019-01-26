const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// not required when building
// require('electron-reload')(__dirname, {
//   electron: require('${__dirname}/../../node_modules/electron')
// })


app.commandLine.appendSwitch('touch-events', 'enabled');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 1281,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: 'red',
    show: false
  })
  mainWindow.maximize();

  // mainWindow.setFullScreen(true);
  mainWindow.setFullScreen(false);
  mainWindow.setMenu(null);
  
  // not required when building
  // mainWindow.webContents.openDevTools();

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'selectors.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

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