var serverurl = 'https://balda-server.herokuapp.com/';
var socket = io.connect(serverurl);
var ipc = require('electron').ipcRenderer;
var fs = require('fs');
let create_lobby_win;
document.getElementById('new_lobby').addEventListener('click', () => {
    let create_lobby_win = new remote.BrowserWindow({
        width: 400,
        height: 200,
        frame: false,
        resizable: false,
        parent: remote.getCurrentWindow(),
        modal: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    create_lobby_win.loadFile('./html/create_lobby.html');
    create_lobby_win.on('closed', (e) => {
        socket.emit('host_join_lobby', username);
    });
});
document.getElementById('send_message').addEventListener('click', () => {
    let mes = String(document.getElementById('chat_input').value);
    if(mes.length == 0) {
        document.getElementById('chat_input').id = 'wrong_input';
        document.getElementById('wrong_input').focus();
        setTimeout(() => {
            document.getElementById('wrong_input').id = 'pass_input';            
            document.getElementById('wrong_input').setAttribute('placeholder', '');
        }, 1000);
    }
    else {
        socket.emit('mes', username, mes);
        document.getElementById('chat_input').value = '';
    }
});
document.getElementById('close_button').addEventListener('click', () => {
    socket.emit('user_logout', username);
  }); 
//Set user profile card
let userProfile = JSON.parse(fs.readFileSync('./cfg.json'));
let username = userProfile.username;
let useravatar = userProfile.useravatar;
document.getElementById('user_profile_username').textContent = username;
document.getElementById('user_profile_avatar').src = useravatar;

let lobby_list = document.getElementById('lobby_list');
let join_buttons = document.querySelectorAll('.join_button');

function renderLobby(id, lobby_title, passlen, connected, required, gameHasbegun) {
    let lock_icon, disablePass, disableJoin, buttonIcon = '<i class="fas fa-sign-in-alt"></i> ';
    if(passlen == 0 || passlen == undefined) {
        lock_icon = 'fas fa-lock-open';
        disablePass = 'disabled';
    } 
    else {
        disablePass = '';
        lock_icon = 'fas fa-lock';
    }
    if(connected == required || gameHasbegun == true) { 
        disableJoin = 'disabled';
        buttonIcon = '<i class="fas fa-door-closed"></i>'; 
    }
    let newLobbyNode =  `
        <ul class="lobby_block" id="${id}">
            <i id="fa-lock" class="${lock_icon}"></i>
            <div class="lobby_title"> ${lobby_title}</div>
            <div class="players_count">
                <i id="fa-users" class="fas fa-users"></i>
                <div class="connected">${connected}/</div> 
                <div class="required">${required}</div>
            </div>
            <div class="pass_wrap"><input type="password" name="pass_input" id="pass_input" ${disablePass}></div>
            <button class="join_button" onclick="addJoinEvent(${id});" ${disableJoin}>${buttonIcon}</button>
        </ul>`;
    lobby_list.innerHTML += newLobbyNode;
    if(connected == required || gameHasbegun == true) document.getElementById(id).className += ' closed_lobby';
}
function addJoinEvent(lobbyId) {
    console.log('Join to ', lobbyId);
    let pass = document.getElementById(lobbyId).getElementsByClassName('pass_wrap')[0].querySelector('#pass_input').value;
    socket.emit('can_i_join_lobby', lobbyId, pass);
}
socket.on('welcome', (lobbyId) => {
    let required = document.getElementById(lobbyId).getElementsByClassName('players_count')[0].querySelector('.required').textContent;
    connectToLobby(lobbyId, required);
});
function connectToLobby(lobbyId, required) {
    let userProfile = fs.readFileSync('./cfg.json');
    userProfile = userProfile.slice(0, -1);
    userProfile += `, "lobbyId" : "${lobbyId}", "required" : "${required}"}`;
    fs.writeFileSync('./cfg.json', userProfile);
    ipc.send('success_join_lobby', 'arg');
}
socket.on('no_welcome', (cause, lobbyId) => {
    if(cause == 'pass') {
        document.getElementById(lobbyId).getElementsByClassName('pass_wrap')[0].querySelector('#pass_input').id = "wrong_input";
        document.getElementById('wrong_input').setAttribute('placeholder', 'Неверный пароль');
        document.getElementById('wrong_input').focus();
        setTimeout(() => {
            document.getElementById('wrong_input').id = "pass_input";            
            document.getElementById('wrong_input').setAttribute('placeholder', '');
        }, 1000);
        console.log('Wrong pass.');
    }
    else if(cause == 'lobby') {
        console.log('Lobby is full.');
    }
    else if(cause == 'started') {
        console.log('Game has already begun.');
    }
});

socket.emit('fetch_lobby_list'); // Asks server to give this client all lobbies
socket.on('pull_lobby_list', (lobbyJson) => {
    let lobbyJsonToList = JSON.parse(lobbyJson).lobbyList;
    setTimeout(() => {
        for(const l of lobbyJsonToList) {
            renderLobby(l.id, l.title, l.passlen, l.connected, l.required, l.gameHasbegun);
        }
    }, 200);
    console.log(lobbyJson);
});
socket.emit('fetch_message_list'); // And messages
socket.on('pull_message_list', (messageListJson) => {
    console.log(messageListJson);
    let newMes;
    let mes;
    let local_time;
    for(m of messageListJson) {
        mes = JSON.parse(m);
        local_time = new Date(mes.dateTime);
        console.log(`Server Time: ${mes.dateTime}`);
        console.log(`Local Time: ${local_time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
        console.log('==============');
        newMes = `
        <div class="message">
            <div class="message_username">${mes.userName}</div>
            <div class="message_text">${mes.message}</div>
            <div class="message_time">${local_time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>`;
        document.getElementById('chat_list').innerHTML += newMes;  
    }
    //Auto scroll down
    let items = document.querySelectorAll(".message");
    last = items[items.length-1];
    if(last != undefined) last.scrollIntoView();
});
socket.on('new_lobby_created', (id, lobby_title, passlen, connected, required) => {
    renderLobby(id, lobby_title, passlen, connected, required, false);
});
socket.on('lobbyListChanges', () => {
    lobby_list.innerHTML = '';
    socket.emit('fetch_lobby_list');
});
socket.on('newMessage', (userName, mes) => {
    let localTime = new Date();
    localTime = localTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    console.log(`${localTime} MES: ${userName}: ${mes}`);
    let newMes = `
    <div class="message">
        <div class="message_username">${userName}</div>
        <div class="message_text">${mes}</div>
        <div class="message_time">${localTime}</div>
    </div>`;
    document.getElementById('chat_list').innerHTML += newMes;
    //Auto scroll down
    let items = document.querySelectorAll(".message");
    last = items[items.length-1];
    last.scrollIntoView();
});
