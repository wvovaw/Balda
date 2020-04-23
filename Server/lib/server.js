let connectedUsersNames = new Set();
let userList = new Set();
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
  let useravatar;
  socket.emit('server_message', 'Hello, my sweet clients! I love you so much.');
/*
*       LOGIN STUF
*
*/
  socket.on('user_login', (user_data) => {
      username = JSON.parse(user_data).username;
      useravatar = JSON.parse(user_data).useravatar;
      if(connectedUsersNames.has(username)) {
          console.log(`Username ${username} is already connected.`);
          socket.emit('wrong_username');
          return;
      }
      connectedUsersNames.add(username);
      let newUser = new User(username, useravatar);
      userList.add(newUser);
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
        "id" : "${l.id}",
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
  socket.on('can_i_join_lobby', (lobbyId, pass) => {
    for(l of lobbyList) { if(l.id == lobbyId) {
        if(l.playerList.length != l.maxPlayers && l.pass == pass) {
          socket.emit('welcome', lobbyId); //Welcome user to join
        }
        else socket.emit('no_welcome'); //refusal
      }
    }
  });
  socket.on('join_lobby', (lobbyId, username, useravatar) => {
    for(l of lobbyList) {
      if(l.id == lobbyId) {
        l.addPlayer(username, useravatar, socket);
        let playerListJson = `{ "playerList" : [`;
        for(p of l.playerList) {
          playerListJson += `{"playerName" : "${p.playerName}", "playerAvatar" : "${p.playerAvatar}", "playerPoints" : "${p.getPoints()}"},`;
        }
        playerListJson = playerListJson.slice(0, -1);
        playerListJson += `]}`;
        socket.emit('succsess_lobby_connection', playerListJson);
      }
    }
  });
  socket.on('host_join_lobby', (username) => {
    for(l of lobbyList) { if(l.host == username) {
      socket.emit('welcome', l.id);
      }
    }
  });
});


class Lobby {
  constructor(socket, title, id, pass, hostUser, maxPlayers) {
      this.title = title;
      this.id = id;
      this.pass = pass;
      this.host = hostUser;
      this.maxPlayers = maxPlayers;

      socket.broadcast.emit('new_lobby_created', this.id, this.title, this.pass.length, this.playerList.length, Number(this.maxPlayers));
      console.log(`Lobby '${this.title}' was succsessfully created by ${this.host}`);
  }
  playerList = []; //userName
  maxPlayers = 2;

  addPlayer(userName, userAvatar, socket) {
    if(this.playerList.length < this.maxPlayers) {
      let player = new Player(userName, userAvatar);
      this.playerList.push(player);
      console.log(`Player ${player.playerName} has succsessfuly connected to lobby ${this.title}`);
      console.log(`Emit about it to all users in lobby ${this.id}`);
      socket.broadcast.emit('lobbyListChanges', this.id, this.playerList.length);
      socket.join(this.id);
      socket.to(this.id).emit('playerConnected', player.playerName, player.playerAvatar, player.getPoints());
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
  constructor(userName, userAvatar) {
      this.playerName = userName;
      this.playerAvatar = userAvatar;
  }
  #points = 0;
  addPoints(points) {
      this.#points += points;
  }
  getPoints() {
    return this.#points;
  }
}


