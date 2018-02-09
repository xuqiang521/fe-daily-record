var http = require('http')
var auth = require('basic-auth')
 
// Create server
var server = http.createServer(function (req, res) {
  var credentials = auth(req)
 
  if (!credentials || credentials.name !== 'john' || credentials.pass !== 'secret') {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="example"')
    res.end('Access denied')
  } else {
    res.end('Access granted')
  }
})
 
// Listen
server.listen(3001)