var http = require('http')
var fs = require('fs')
var parse = require('url').parse
var join = require('path').join

var root = __dirname

var server = http.createServer((req, res) => {
  var url = parse(req.url)
  var path = join(root, url.pathname)

  // 检查文件是否存在 
  fs.stat(path, (err, stat) => {
    if (err) {
      // 文件不存在 
      if (err.code === 'ENOENT') {
        res.statusCode = 404
        res.end('Not Found')
      } else {
        res.statusCode = 500
        res.end('Internal Server Error')
      }
    } else {
      res.setHeader('Content-Length', stat.size)
      var stream = fs.createReadStream(path)

      stream.pipe(res)
      stream.on('error', (err) => {
        res.statusCode = 500
        res.end('Internal Server Error')
      })
    }
  })

})

server.listen(3000)