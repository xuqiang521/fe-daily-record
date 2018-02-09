var connect = require('connect')
var static = require('serve-static')

var app = connect()

app
  .use('/limit', static('public'))
  .listen(3001)
