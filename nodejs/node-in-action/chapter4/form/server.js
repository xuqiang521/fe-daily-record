var http = require('http')
var qs = require('querystring')
var items = []

function show (res) {
  var lis = items.map((item) => {
    return `<li>${item}</li>`
  })
  console.log(lis)
  var html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Todo List</title>
  </head>
  <body>
    <h1>Todo List</h1>
    <ul>${lis.join('')}</ul>
    <form action="/" method="post">
      <p><input type="text" name="item"></p>
      <p><input type="submit" value="Add Item"></p>
    </form>
  </body>
  </html>`
  console.log(html)
  res.setHeader('Content-type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html)
}

function notFound (res) {
  res.statusCode = 404
  res.setHeader('Content-type', 'text/plain')
  res.end('Not Found')
}

function badRequest (res) {
  res.statusCode = 400
  res.setHeader('Content-type', 'text/plain')
  res.end('Bad Request')
}

function add (req, res) {
  var body = ''
  req.setEncoding('utf8')
  req.on('data', (chunk) => {
    body += chunk
  })
  req.on('end', () => {
    var obj = qs.parse(body)
    items.push(obj.item)
    console.log(items)
    show(res)
  })
}

var server = http.createServer((req, res) => {
  if ('/' === req.url) {
    switch (req.method) {
      case 'GET':
        show(res)
        break;

      case 'POST':
        add(req, res)
        break;

      default:
        badRequest(res)
        break;
    }
  } else {
    notFound(res)
  }
})

server.listen(3000)