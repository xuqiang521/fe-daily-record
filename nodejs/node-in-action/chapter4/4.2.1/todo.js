var http = require('http')
var url = require('url')
// 用一个常规的 JavaScript 数组存放数据
var items = []

var server = http.createServer((req, res) => {
  switch(req.method) {
    case 'POST':
      var item = ''
      req.setEncoding('utf8')
      req.on('data', (chunk) => {
        item += chunk
      })
      req.on('end', () => {
        items.push(item)
        res.end('OK \n')
      })
      break;
    case 'GET':
      // items.forEach((item, i) => {
      //   res.write(i + ') ' + item + '\n')
      // })
      // res.write("hello socket \n")
      // res.end()
      var body = items.map((item, i) => {
        return i + ') ' + item
      }).join('\n')
      res.setHeader('Content-Length', Buffer.byteLength(body))
      res.setHeader('Content-type', 'text/plain; charset="utf-8')
      res.end(body)
      break;
    case 'DELETE':
      var path = url.parse(req.url).pathname
      var i = parseInt(path.slice(1), 10)

      if (isNaN(i)) {
        res.statusCode = 400
        res.end('Invalid item id')
      } else if (!items[i]) {
        res.statusCode = 404
        res.end('Item not found')
      } else {
        items.splice(i, 1)
        res.end('DELETE SUCCESS \n')
      }
      break;
  }
})

server.listen(3000, '127.0.0.1')