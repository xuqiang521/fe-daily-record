var net = require('net')

net.createServer(socket => {
  socket.write('hello world!\r\n')
  console.log('socket connected');

  socket.on('data', data => {
    console.log('"data" event', data);
  })

  socket.on('close', () => {
    console.log('"close" event');
  })

  socket.on('error', err => {
    console.log('"error" event', err);
  })

  socket.pipe(socket)

}).listen(1337)

console.log('listening op port 1337');