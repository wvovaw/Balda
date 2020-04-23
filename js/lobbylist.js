var socket = io.connect('http://localhost:3010');
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
    create_lobby_win.webContents.openDevTools();

    create_lobby_win.on('closed', (e) => {
        socket.emit('host_join_lobby', username);
    });
});
//Set user profile card
let userProfile = JSON.parse(fs.readFileSync('./cfg.json'));
let username = userProfile.username;
document.getElementById('user_profile_username').textContent = username;

let lobby_list = document.getElementById('lobby_list');
let join_buttons = document.querySelectorAll('.join_button');

function renderLobby(id, lobby_title, passlen, connected, required) {
    let lock_icon, disable;
    if(passlen == 0 || passlen == undefined) {
        lock_icon = 'fas fa-lock-open';
        disable = 'disabled';
    } 
    else {
        lock_icon = 'fas fa-lock';
        disable = '';
    }
    let newLobbyNode =  `
        <ul class="lobby_block" id="${id}">
            <i id="fa-lock" class="fas ${lock_icon}"></i>
            <div class="lobby_title"> ${lobby_title}</div>
            <div class="players_count">
                <i id="fa-users" class="fas fa-users"></i>
                <div class="connected">${connected} / </div> 
                <div class="required">${required}</div>
            </div>
            <div class="pass_wrap"><input type="password" name="pass_input" id="pass_input" ${disable}></div>
            <button class="join_button" onclick="addJoinEvent(${id});"><i class="fas fa-sign-in-alt"></i></button>
        </ul>`;
    lobby_list.innerHTML += newLobbyNode;
}
function addJoinEvent(lobbyId) {
    console.log('Join to ', lobbyId);
    //Implement user enter to lobby
    let pass = document.getElementById(lobbyId).getElementsByClassName('pass_wrap')[0].querySelector('#pass_input').value;
    socket.emit('can_i_join_lobby', lobbyId, pass);
}

socket.emit('fetch_lobby_list'); // Asks server to give this client all lobbies
socket.on('pull_lobby_list', (lobbyJson) => {
    let lobbyJsonToList = JSON.parse(lobbyJson).lobbyList;
    console.log(lobbyJsonToList);
    for(const l of lobbyJsonToList) {
        renderLobby(l.id, l.title, l.passlen, l.connected, l.required);
    }
    console.log(lobbyJson);
}); //and handle it

socket.on('new_lobby_created', (id, lobby_title, passlen, connected, required) => {
    renderLobby(id, lobby_title, passlen, connected, required);
});

socket.on('lobbyListChanges', (lobbyId, connected) => {
    console.log(`${lobbyId} has changed`);
    let lobby = document.getElementById(lobbyId);
    console.log(lobby);
    lobby.getElementsByClassName('players_count')[0].getElementsByClassName('connected')[0].textContent = connected + '/';
});

socket.on('welcome', (lobbyId) => {
    connectToLobby(lobbyId);
});
function connectToLobby(lobbyId) {
    let userProfile = fs.readFileSync('./cfg.json');
    userProfile = userProfile.slice(0, -1);
    userProfile += `, "lobbyId" : "${lobbyId}"}`;
    fs.writeFileSync('./cfg.json', userProfile);
    ipc.send('success_join_lobby', 'arg');
}
socket.on('no_welcome', () => {
    console.log('Lobby is full or you\'ve inputed the wrong password.');
});