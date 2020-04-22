var socket = io.connect('http://localhost:3010');
var ipc = require('electron').ipcRenderer;
var fs = require('fs');

let username;

socket.on('success_login', () => {
  console.log(`Log-inned as ${username}!`);
  window.username = username;
  ipc.send('success_login', 'an-argument');
});
socket.on('wrong_username', () => {
    console.log('Username is unavaliable. Please, try another');
});
socket.on('server_message', (data) => {
   console.log(`!SERVER: ${data}`);
});
document.getElementById('enter_button').addEventListener('click', (e) => {
    e.preventDefault();
    username = document.getElementById('username').value
    if(username.length == 0 || username.length == undefined) {
        document.getElementById('username').id = "wrong_username";
        document.getElementById('wrong_username').focus();
        setTimeout(() => {
            document.getElementById('wrong_username').id = "username";
        }, 1000);
    }
    else {
        socket.emit('user_login', `{"username" : "${username}"}`);
        sessionStorage.setItem('username', username);    
        fs.writeFileSync('./cfg.json', `{"username" : "${username}"}`);
    }
});
