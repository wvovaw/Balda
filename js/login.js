var serverurl = 'https://balda-server.herokuapp.com/';
var socket = io.connect(serverurl);
var ipc = require('electron').ipcRenderer;
var fs = require('fs');

let username;
let useravatar = `https://picsum.photos/72/72?random=1`;

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
//Add avatar choosing system
document.getElementById('enter_button').addEventListener('click', (e) => {
    e.preventDefault();
    let un = document.getElementById('username');
    username = un.value;
    if(username.length == 0 || username.length == undefined) {
        un.id = "wrong_username";
        document.getElementById('wrong_username').focus();
        setTimeout(() => {
            document.getElementById('wrong_username').id = "username";
        }, 1000);
    }
    else if(username.length > 14) {
        un.id = "wrong_username";
        un.value = '';
        un.setAttribute('placeholder', 'Уложитесь в 14 символов)');
        document.getElementById('wrong_username').focus();
        setTimeout(() => {
            document.getElementById('wrong_username').id = "username";
            un.setAttribute('placeholder', '');
        }, 1000);
    }
    else {
        let userdata = `{"username" : "${username}", "useravatar" : "${useravatar}"}`;
        socket.emit('user_login', userdata);
        fs.writeFileSync('./cfg.json', userdata);
    }
});
