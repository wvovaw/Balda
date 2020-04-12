const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
Menu.setApplicationMenu(false)
function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 980,
    height: 700,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })
  mainWindow.loadFile('index.html')
  mainWindow.webContents.openDevTools();
}
app.whenReady().then(createWindow)
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

