var http = require('http')

function fib (n) {
  if (n < 2) {
    return 1
  } else {
    return fib(n - 2) + fib(n - 1)
  }
}

var server = http.createServer((req, res) => {
  var num = parseInt(req.url.substring(1), 10)
  console.log(req.url, num);
  res.writeHead(200)
  res.end(fib(num) + '\n')
})

server.listen(8000)