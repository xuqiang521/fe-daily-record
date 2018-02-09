var connect = require('connect')
var favicon = require('serve-favicon')
var logger = require('morgan')

var app = connect()

app.use(favicon(__dirname, '/public/favicon.ico'))
   .use(logger())
   .use(function (req, res) {
     res.end('hello world! \n')
   })
   .listen(3000)