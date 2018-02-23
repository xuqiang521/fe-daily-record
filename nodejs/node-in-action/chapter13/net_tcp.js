var net = require('net')

var socket = net.connect({ host: process.argv[2], port: 22 })
socket.setEncoding('utf8')

socket.once('data', chunk => {
  console.log('SSH server version: %j', chunk.trim());
  socket.pipe(socket)
  socket.end()
})

socket.on('close', () => {
  console.log('client disconnected');
})