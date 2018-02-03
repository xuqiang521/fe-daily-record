var net = require('net')

var server = net.createServer((socket) => {
  console.log('client')
  socket.once('data', (data) => {
    console.log(data.toString())
    socket.write(data)
  })
})

server.listen(8888)

console.log('Server runing at port 8888')