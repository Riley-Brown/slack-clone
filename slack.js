const express = require('express');
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

// io.on = io.of('/').on
io.on('connection', socket => {
  // array to send back img and endpoint for each namespace
  let nsData = namespaces.map(ns => {
    return {
      img: ns.img,
      endpoint: ns.endpoint
    };
  });

  // send ns data back to client. Need to use socket NOT io because we want it to go just to this client
  socket.emit('nsList', nsData);
});

// loop through namespace and listen for connection
namespaces.forEach(namespace => {
  io.of(namespace.endpoint).on('connection', nsSocket => {
    // console.log(`${socket}`);
    console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
    // socket has connected to a namespace
    // send ns info back
    nsSocket.emit('nsRoomLoad', namespaces[0].rooms);
    nsSocket.on('joinRoom', roomToJoin => {
      nsSocket.join(roomToJoin);
    });
  });
});
