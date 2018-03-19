var http = require('http')
var fs = require('fs')

function serveStaticFile (res, path, contentType, responseCode) {
  if (!responseCode) responseCode = 200
  fs.readFile(__dirname + path, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('500 - Internal Error')
    } else {
      res.writeHead(responseCode, { 'Content-Type': contentType })
      res.end(data)
    }
  })
}

http.createServer((req, res) => {
  // 规范化 url，去掉查询字符串、可选的反斜杠，并把它变成小写
  var path = req.url.replace('/\/?(?:\?.*)?$/', '').toLowerCase()
  console.log(path);
  switch (path) {
    case '/':
      serveStaticFile(res, '/public/home.html', 'text/html')
      break;
    case '/about':
      serveStaticFile(res, '/public/about.html', 'text/html')
      break;
    case '/img/logo.jpg':
      serveStaticFile(res, '/public/img/logo.jpg', 'image/jpeg')
      break;
  
    default:
      serveStaticFile(res, '/public/404.html', 'text/html')
      break;
  }
}).listen(3000)

// http.createServer((req, res) => {
//   // 规范化 url，去掉查询字符串、可选的反斜杠，并把它变成小写
//   var path = req.url.replace('/\/?(?:\?.*)?$/', '').toLowerCase()
//   console.log(path);
//   switch (path) {
//     case '/':
//       res.writeHead(200, { 'Content-Type': 'text/plain' })
//       res.end('HomePage')
//       break;
//     case '/about':
//       res.writeHead(200, { 'Content-Type': 'text/plain' })
//       res.end('About')
//       break;
  
//     default:
//       res.writeHead(404, { 'Content-Type': 'text/plain' })
//       res.end('Not Found')
//       break;
//   }
// }).listen(3000)

console.log('Server started on localhost:3000; press Ctrl-C to terminate');