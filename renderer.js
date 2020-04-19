const {remote, ipcRenderer} = require('electron')

document.getElementById('minimize_button').addEventListener('clicl', () => {
  remote.BrowserWindow.getFocusedWindow().minimize();
});

document.getElementById('close_button').addEventListener('click', () => {
    remote.app.quit();
});