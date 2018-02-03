var events = require('events')
var net = require('net')

var channel = new events.EventEmitter()
channel.clients = {}
channel.subscriptions = {}

// 添加join事件的监听器，保存用户的client对象，以便程序可以将数据发送给用户
channel.on('join', (id, client) => {
  channel.clients[id] = client
  channel.subscriptions[id] = function (senderId, message) {
    if (id !== senderId) {
      channel.clients[id].write(message)
    }
  }
  var welcome = "Welcome!\n" + "Guests online " + channel.listeners('broadcast').length;
  client.write(welcome + '\n');
  channel.on('broadcast', channel.subscriptions[id])
})

channel.on('leave', (id) => {
  channel.removeListener('broadcast', channel.subscriptions[id])
  channel.emit('broadcast', id, id + ' has left the chat .\n')
})

channel.on('shutdown', () => {
  channel.emit('broadcast', '', 'Chat has shut down.\n')
  channel.removeAllListeners('broadcast')
})

channel.setMaxListeners(2)

var server = net.createServer((client) => {
  var id = client.remoteAddress + ':' + client.remotePort
  // client.on('connection', () => {
    channel.emit('join', id, client)
  // })
  client.on('data', (data) => {
    data = data.toString()
    if (data === 'shutdown\r\n') {
      channel.emit('shutdown')
    }
    channel.emit('broadcast', id, data)
  })
  client.on('close', () => {
    channel.emit('leave', id)
  })
})

server.listen(8888)