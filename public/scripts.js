const socket = io('http://localhost:9000'); // the / namespace/endpoint
let nsSocket = '';

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
  joinNs('/wiki');
});
