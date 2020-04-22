const connectedUsers = new Set();
let lobbyList = [];
let lobbyIdCounter = 0;
ipAddress = '127.0.0.1';
//const {User, Lobby, Player} = require('../entities.js');


const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

exports.server = {
  run(port) {
    server.listen(port, () => {
      console.log('Server listening at port %d', port);
    });
  },
};

io.on('connection', (socket) => {
  let username;
  socket.emit('server_message', 'Hello, my sweet clients! I love you so much.');
/*
*       LOGIN STUF
*
*/
  socket.on('disconnect', () => {
    connectedUsers.delete(username);
    //socket.broadcast.emit('logout', { username, users: Array.from(connectedUsers)});
    console.log(`User ${username} has disconnected.`);
  });
  socket.on('user_login', (user_data) => {
      username = JSON.parse(user_data).username;
      if(connectedUsers.has(username)) {
          console.log(`Username ${username} is already connected.`);
          socket.emit('wrong_username');
          return;
      }
      connectedUsers.add(username);
      socket.emit('success_login');
      console.log(`User ${username} has successfully connected.`);
  });
/*
*     LOBBY STUF
*
*/
  socket.on('create_lobby', (lobby_data) => {
    let lobby = JSON.parse(lobby_data);
    for(l of lobbyList) {
      if(l.title == lobby.title) {
        socket.emit('wrong_lobby_data');
        console.log(`ERR! Lobby ${l.title} already exists!`);
        return;   
      }
    }
    let newLobby = new Lobby(socket, lobby.title, lobbyIdCounter++, lobby.pass, lobby.host, lobby.maxPlayers, socket);
    lobbyList.push(newLobby);
  });
  socket.on('fetch_lobby_list', () => {
    //Create json file with all lobbies 
    let lobbyJson = `{
      "lobbyList":
         [
           `;
    for(l of lobbyList) {
      lobbyJson += `{
        "title" : "${l.title}",
        "passlen" : "${l.pass.length}",
        "connected" : "${l.playerList.length}",
        "required" : "${l.maxPlayers}"
      },
      `;
    }
    lobbyJson = lobbyJson.slice(0, -8);
    lobbyJson += `]
    }`;
    socket.emit('pull_lobby_list', lobbyJson);
  });
});


class Lobby {
  constructor(socket, title, id, pass, hostUser, maxPlayers) {
      this.title = title;
      this.id = id;
      this.pass = pass;
      this.host = hostUser;
      this.maxPlayers = maxPlayers;

      socket.broadcast.emit('new_lobby_created', this.id, this.pass.length, this.title, Number(this.maxPlayers), this.playerList.length);
      this.addPlayer(hostUser, socket);
      console.log(`Lobby '${this.title}' was succsessfully created by ${this.host}`);
  }
  playerList = Array(); //userName
  maxPlayers = 2;

  addPlayer(userName, socket) {
      if(this.playerList.length < this.maxPlayers) {
        let player = new Player(userName);
        this.playerList.push(player);
        console.log(`Player ${player.playerName} has succsessfuly connected to lobby ${this.title}`);
        socket.broadcast.emit('newPlayerInlobby', this.id, this.playerList.length);
      } 
  }
  kickPlayer(userName) {
      var pos = this.playerList.indexOf(userName);
      if(pos > -1) {
          var removedPlayer = playerList[pos].userName;
          this.playerList.splice(pos, 1);
          console.log(`Player ${removedPlayer} has disconnected from the '${this.title}'`);
      } 
  }
  startGame() {
     //Send start game signal to all clients from the playerList
     //there is gonna be an implementation of the game cycle (player 1, 2, 3, 4, 5) untill the gamefield isn't filled
     
  }
  endGame() {
      //End game signal to trigger end-game window 
  }
}
class User {
  constructor(userName, userAvatar) {
    this.userName = userName;
    this.userAvatar = userAvatar;
  }
}
class Player {
  constructor(userName) {
      this.playerName = userName;
  }
  #points = 0;
  addPoints(points) {
      this.#points += points;
  }
}

