const {remote} = require('electron');

document.getElementById('minimize_button').addEventListener('click', () => {
  remote.BrowserWindow.getFocusedWindow().minimize();
});

document.getElementById('close_button').addEventListener('click', () => {
    remote.app.quit();
});