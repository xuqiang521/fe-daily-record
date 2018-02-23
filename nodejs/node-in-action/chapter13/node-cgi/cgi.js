var http = require('http')
var cgi = require('cgi')

var server = http.createServer( cgi('hello.cgi') )

server.listen(3000)