function joinRoom(roomName) {
  // send to server
  nsSocket.emit('joinRoom', roomName);
}
