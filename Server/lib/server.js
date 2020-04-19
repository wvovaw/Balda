const connectedUsers = new Set();
let lobbyList = [];
ipAddress = '127.0.0.1';

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
  
  socket.on('disconnect', () => {
    connectedUsers.delete(username);
    //socket.broadcast.emit('logout', { username, users: Array.from(connectedUsers)});
    console.log(`User ${username} has disconnected.`);
  });
  socket.on('user_login', (data) => {
      username = JSON.parse(data).username;
      if(connectedUsers.has(username)) {
          console.log(`Username ${username} is already connected.`);
          socket.emit('wrong_username');
          return;
      }
      connectedUsers.add(username);
      socket.emit('success_login');
      console.log(`User ${username} has successfully connected.`);
  });
});
