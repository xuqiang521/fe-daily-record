var fs = require('fs')
var url = require('url')
var http = require('http')
var path = require('path')
var express = require('express')
var static = require('serve-static')
var app = express()
var server = http.createServer(app)
var io = require('socket.io').listen(server)
var root = __dirname

app.use((req, res, next) =>{
  req.on('static', () => {
    var file = url.parse(req.url).pathname
    console.log(file);
    var mode = 'stylesheet'
    if (file[file.length - 1] === '/') {
      file += 'index.html'
      mode = 'reload'
    }
    createWatcher(file, mode)
  })
  next()
})

app.use(static(root))

var watchers = {}

function createWatcher (file, mode) {
  var abs = path.join(root, file)

  if (watchers[abs]) {
    return
  }

  fs.watchFile(abs, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
      io.sockets.emit(event, file)
    }
  })

  watchers[abs] = true
}

server.listen(3000)
