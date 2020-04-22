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
});

let lobby_list = document.getElementById('lobby_list');

function renderLobby(id, passlen, lobby_title, required, connected) {
    if(passlen == 0 || passlen == undefined) lock_icon = 'fas fa-lock-open';
    else lock_icon = 'fas fa-lock';
    
    lobby_list.innerHTML += `
        <ul class="lobby_block" id="${id}">
            <i id="fa-lock" class="fas ${lock_icon}"></i>
            <div class="lobby_title"> ${lobby_title}</div>
            <div class="players_count">
                <i id="fa-users" class="fas fa-users"></i>
                <div class="connected">${connected} / </div> 
                <div class="required">${required}</div>
            </div>
            <div class="pass_wrap"><input type="password" name="pass_input" id="pass_input"></div>
            <button class="join_button"><i class="fas fa-sign-in-alt"></i></button>
        </ul>`
}

socket.emit('fetch_lobby_list'); // Asks server to give this client all lobbies
socket.on('pull_lobby_list', (lobbyJson) => {
    let lobbyJsonToList = JSON.parse(lobbyJson).lobbyList;
    console.log(lobbyJsonToList);
    console.log(typeof(lobbylobbyJsonToListJson));
    for(l of lobbyJsonToList) {
        renderLobby(l.id, l.passlen, l.title, l.required, l.connected);
    }
    console.log(lobbyJson);
}); //and handle it

socket.on('new_lobby_created', (id, passlen, lobby_title, required, connected) => {
    renderLobby(id, passlen, lobby_title, required, connected);
});

socket.on('newPlayerInlobby', (lobbyId, connected) => {
    console.log(lobbyId);
    let lobby = document.getElementById(String(lobbyId));
    lobby.getElementsByClassName('players_count')[0].getElementsByClassName('connected')[0].textContent = connected + '/';
    console.log(lobby);
});

