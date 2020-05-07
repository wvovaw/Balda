const {app, BrowserWindow, Menu} = require('electron')
const path = require('path');

//require('electron-reload')(__dirname);
Menu.setApplicationMenu(false);
let mainWindow;
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 700,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })
  mainWindow.loadFile(`./html/login.html`);
  mainWindow.webContents.openDevTools();
}
app.whenReady().then(createWindow);

const {ipcMain} = require('electron');
ipcMain.on('success_login', () => {
  mainWindow.loadFile('./html/lobbylist.html');
});
ipcMain.on('success_join_lobby', () => {
  mainWindow.loadFile('./html/game.html');
});
ipcMain.on('to_lobbyList', () => {
  mainWindow.loadFile('./html/lobbylist.html');
});

app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

