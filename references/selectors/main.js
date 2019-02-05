const electron = require('electron');
const { ipcMain, dialog } = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
// const appIcon = new Tray('/icons/png/16x16.png')
const iconPath = "icons/win/1.ico";

// NOT REQUIRED WHEN BUILDING
require('electron-reload')(__dirname, {
  electron: require('${__dirname}/../../node_modules/electron')
})

app.commandLine.appendSwitch('touch-events', 'enabled');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    title: "CSS Selectors",
    minWidth: 800,
    minHeight: 600,
    backgroundColor: 'red',
    icon: iconPath,
    show: false
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'selectors.html'),
    protocol: 'file:',
    slashes: true
  }));

  // NOT REQUIRED WHEN BUILDING
  // mainWindow.webContents.openDevTools();

  mainWindow.setMenu(null);
  mainWindow.maximize();
  // mainWindow.setFullScreen(true);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  ipcMain.on('synchronous-message', (event, arg) => {
    if (arg == "showCreditWindow") {
      console.log("open credit window")

      let childWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        title: "Credit",
        width: 400,
        height: 400,
        backgroundColor: 'red',
        resizable: false,
        movable: false,
        autoHideMenuBar: true,
        show: false,
        // frame: false,
        icon: iconPath,
        minimizable: false,
        titleBarStyle: 'hidden'
      })

      childWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'credit.html'),
        protocol: 'file:',
        slashes: true
      }));

      childWindow.once('ready-to-show', () => {
        childWindow.show()
      })

      // NOT REQUIRED WHEN BUILDING
      // childWindow.webContents.openDevTools();

      // return is important (otherwise, window open on only first click)
      event.returnValue = 'creditWindowOpening'

    } else if (arg == "showFeedbackWindow") {

      console.log("open feedback window")

      let childWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        title: "Feedback",
        width: 800,
        height: 700,
        backgroundColor: 'red',
        resizable: false,
        // movable: false,
        icon: iconPath,
        autoHideMenuBar: true,
        show: false
      })

      childWindow.webContents.on('will-prevent-unload', (event) => {

        const choice = dialog.showMessageBox(new BrowserWindow({
          show: false,
          alwaysOnTop: true
          }),
          {
            type: 'question',
            buttons: ['Leave', 'Stay'],
            title: 'Do you want to leave this site?',
            message: 'Changes you made may not be saved.',
            defaultId: 1,
            cancelId: 1
          }
        )
        const leave = (choice === 0)
        if (leave) {
          event.preventDefault()
        }
      })

      childWindow.loadURL("https://goo.gl/forms/JWz7jGuwAVYOvvaz1");

      childWindow.once('ready-to-show', () => {
        childWindow.show()
        mainWindow.webContents.send('app-close');
      })
      
      // childWindow.webContents.on('did-finish-load', function() {
      //   console.log('finished loading')
      // })
      
      childWindow.on('close', function () {
        // console.log('closedddd')
        childWindow = null;
      });

      // NOT REQUIRED WHEN BUILDING
      // childWindow.webContents.openDevTools();

      // return is important (otherwise, window open on only first click)
      event.returnValue = 'feedbackWindowOpening'
    }
  })
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