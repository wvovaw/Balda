/* global io remote */
var serverurl = 'https://balda-server.herokuapp.com/';
var socket = io.connect(serverurl);
var ipc = require('electron').ipcRenderer;
var fs = require('fs');
// var { dialog } = require('electron').remote;
let username;
let useravatar = ``;
let password;

socket.on('success_register', () => {
  console.log('You\'ve been successfully registered!');
  password = document.getElementById('password').value;
  console.log('Pass: ', password);
  let userdata = `{"username" : "${username}", "userpassword" : "${password}", "useravatar" : "${useravatar}"}`;
  socket.emit('user_login', userdata);
});
socket.on('register_failed', () => {
  console.log('Register failed');
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.getElementById('confirm_password').value = '';
});
socket.on('success_login', () => {	
  console.log(`Log-inned as ${username}!`);
  ipc.send('success_login', 'an-argument');
});
socket.on('login_failed', () => {
  console.log('Login failed');
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
});
socket.on('wrong_username', () => {
  console.log('Username is unavaliable. Please, try another');
});
socket.on('server_message', (data) => {
  console.log(`!SERVER: ${data}`);
});
// eslint-disable-next-line no-unused-vars
function confirmLogin() {
  let un = document.getElementById('username');
  let ps = document.getElementById('password');
  username = un.value;
  password = ps.value;                                                        
  if(username.length == 0 || username.length == undefined) {
    un.id = 'wrong_input';
    document.getElementById('wrong_input').focus();
    setTimeout(() => {
      document.getElementById('wrong_input').id = 'username';
    }, 1000);
  }
  else if(username.length > 14) {
    un.id = 'wrong_input';
    un.value = '';
    un.setAttribute('placeholder', 'Уложитесь в 14 символов)');
    document.getElementById('wrong_input').focus();
    setTimeout(() => {
      document.getElementById('wrong_input').id = 'username';
      un.setAttribute('placeholder', 'username');
    }, 1000);
  }
  else {
    let userdata = `{"username" : "${username}", "userpassword" : "${password}", "useravatar" : "${useravatar}"}`;
    socket.emit('user_login', userdata);
    fs.writeFileSync('./cfg.json', userdata);
  }
}
// eslint-disable-next-line no-unused-vars
function register() {
  document.getElementById('login_card').innerHTML = `
         <div id="avatar" onclick="avatarPicker();"></div>
         <div id="register">
           <input type="text" name="username" id="username" placeholder="username" autofocus>
           <input type="password" name="password" id="password" placeholder="password">
           <input type="password" name="confirm_password" id="confirm_password" placeholder="comfirm password">
           <button id="confirm_button" onclick="confirmRegister();">Готово</button>
           <br>
           <a id="cancel_register_button" onclick="cancelRegister();">Отмена</a>
         </div>`;
}
// eslint-disable-next-line no-unused-vars
function confirmRegister() {
  let un = document.getElementById('username');
  let ps = document.getElementById('password');
  let cps = document.getElementById('confirm_password');
  username = un.value;
  password = ps.value;
  let conf_pass = cps.value;
  if(username.length == 0 || username.length == undefined) {
    un.id = 'wrong_input';
    document.getElementById('wrong_input').focus();
    setTimeout(() => {
      document.getElementById('wrong_input').id = 'username';
    }, 1000);
  }
  else if(username.length > 14) {
    un.id = 'wrong_input';
    un.value = '';
    un.setAttribute('placeholder', 'Не более  14 символов)');
    document.getElementById('wrong_input').focus();
    setTimeout(() => {
      document.getElementById('wrong_input').id = 'username';
      un.setAttribute('placeholder', 'username');
    }, 1000);
  }
  else {
    if(password.length < 6 || password.replace(/\s+/g, '').length < password.length) {
      ps.id = 'wrong_input';
      document.getElementById('wrong_input').focus();
      ps.value = '';
      cps.value = '';
      setTimeout(() => {
        document.getElementById('wrong_input').id = 'password'; 
      }, 1000);
    }
    else if(conf_pass != password) {
      cps.id = 'wrong_input';
      document.getElementById('wrong_input').focus();
      ps.value = '';
      cps.value = '';
      setTimeout(() => {
        document.getElementById('wrong_input').id = 'confirm_password'; 
      }, 1000);
    }
    else {
      let userdata = `{"username" : "${username}", "userpassword" : "${password}", "useravatar" : "${useravatar}"}`;
      console.log(userdata);
      socket.emit('user_register', userdata);
      fs.writeFileSync('./cfg.json', userdata);
    }
  }
}
// eslint-disable-next-line no-unused-vars
function cancelRegister() {
  document.getElementById('login_card').innerHTML = `
         <div id="avatar"></div>
         <div id="login">
           <input type="text" name="username" id="username" placeholder="username" autofocus>
           <input type="password" name="password" placeholder="password" id="password">
           <button id="enter_button" onclick="confirmLogin();">Войти</button>
           <br>
           <a id="register_button" onclick="register();">Зарегистрироваться</a>
         </div>`;
}
// eslint-disable-next-line no-unused-vars
async function avatarPicker() {
  let {dialog} = remote;
  let file = await dialog.showOpenDialog({
    properties: ['openFile', 'singleselection'],
    filters: [{
      name: 'Images',
      extensions: ['jpg', 'jpeg', 'png']
    }]
  });
  if(file.filePaths.length !== 0) {
    let bitmap = fs.readFileSync(file.filePaths[0]);
    useravatar = new Buffer(bitmap).toString('base64');
    document.getElementById('avatar').style.backgroundImage = `url(data:image/png;base64,${useravatar})`;
  }
}
