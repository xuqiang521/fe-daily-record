var connect = require('connect')
var directory = require('serve-index')
var static = require('serve-static')

var app = connect()

app
  .use('/files', directory('public', { icons: true, hidden: true }))
  .use('/files', static('public', { hidden: true }))
  .listen(3001)