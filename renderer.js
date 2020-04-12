const {remote, ipcRenderer} = require('electron')

document.getElementById('minimize_button').addEventListener('mouseup', () => {
  remote.getCurrentWindow().minimize();
})

document.getElementById('close_button').addEventListener('mouseup', () => {
    remote.app.quit();
})