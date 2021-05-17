const {app, BrowserWindow, ipcMain} = require('electron');
// import { app, BrowserWindow } from 'electron';

let mainWindow;
let mediaSelectionWindow;
let selectedMediaId = null;

app.on('window-all-closed', () => {
  if (process.platform != 'darwin')
    app.quit();
});

// app.setPath("userData", __dirname + "/saved_recordings");

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  });

  mainWindow.loadURL('file://' + __dirname + '/main/index.html');

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

ipcMain.on('select-media', (event, arg) => {
  console.log('select-media');
  mediaSelectionWindow = new BrowserWindow({
    parent: 'top',
    modal: true,
    show: false,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  });

  mediaSelectionWindow.loadURL('file://' + __dirname + '/sourcePicker/sourcePicker.html');
  mediaSelectionWindow.on('ready-to-show', () => {
    mediaSelectionWindow.show();
  });

  mediaSelectionWindow.on('close', (e) => {
    console.log('close window');
    event.reply('selected-media-id', selectedMediaId);
  })
  mediaSelectionWindow.webContents.openDevTools();

})

ipcMain.on('selected-media', (event, mediaId) => {
  console.log(mediaId);
  selectedMediaId = mediaId;
})