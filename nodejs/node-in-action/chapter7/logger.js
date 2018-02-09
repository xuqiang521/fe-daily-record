var connect = require('connect')
var logger = require('morgan')
var url = require('url')
var fs = require('fs')

var app = connect()
// logger.token('query-string', function (req, res) {
//   return url.parse(req.url).query
// })
app.use(logger({format: ':method :url', stream: log}))
   .listen(3001)