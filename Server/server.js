const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const clientPath = `${__dirname}/../main.js;`;
console.log(`Serving static from ${clientPath}`);
app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

io.on('connect', (sock) => {
    sock.emit('message', 'You are connected');
} )

server.on('error', (e) => {
    console.log('Server error:', e);
});

server.listen(8080, () => {
    console.log('The Balda started on 8080');
}); 