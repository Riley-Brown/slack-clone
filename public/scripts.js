const socket = io('http://localhost:9000'); // the / namespace/endpoint

console.log(socket.io);

socket.on('connect', () => {
  console.log(socket.id);
});

// listen for nsList which is every namespace
socket.on('nsList', nsData => {
  console.log('list of namespaces');
  let namespacesDiv = document.querySelector('.namespaces');
  nsData.forEach(ns => {
    namespacesDiv.innerHTML += `
    <div class="namespace" ns=${ns.endpoint}> 
      <img src=${ns.img} />
    </div>
    `;
  });

  Array.from(document.getElementsByClassName('namespace')).forEach(el => {
    console.log(el);
    el.addEventListener('click', e => {
      const nsEndpoint = el.getAttribute('ns');
      console.log(nsEndpoint);
    });
  });

  const nsSocket = io('http://localhost:9000/wiki');
  nsSocket.on('nsRoomLoad', nsRooms => {
    console.log(nsRooms);
    let roomList = document.querySelector('.room-list');
    nsRooms.forEach(room => {
      let glyph;
      if (room.privateRoom) {
        glyph = 'lock';
      } else {
        glyph = 'globe';
      }
      roomList.innerHTML += `
      <li class="room">
        <span class="glyphicon glyphicon-${glyph}"></span>
     ${room.roomTitle}
      </li>`;
    });
    let roomNodes = document.getElementsByClassName('room');
    Array.from(roomNodes).forEach(elm => {
      elm.addEventListener('click', e => {
        console.log(`someone clicked on ${e.target.innerText}`);
      });
    });
  });
});

socket.on('messageFromServer', dataFromServer => {
  console.log(dataFromServer);
  socket.emit('dataToServer', { data: 'Data from the Client!' });
});

document.querySelector('#message-form').addEventListener('submit', event => {
  event.preventDefault();
  const newMessage = document.querySelector('#user-message').value;
  socket.emit('newMessageToServer', { text: newMessage });
});

socket.on('messageToClients', msg => {
  console.log(msg);
  document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`;
});

// socket.on('ping',()=>{
//     console.log('Ping was recieved from the server.');
//     console.log(io.protocol)
// })

// socket.on('pong',(latency)=>{
//     console.log(latency);
//     console.log("Pong was sent to the server.")
// })
