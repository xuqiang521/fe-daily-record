var connect = require('connect')
var query = require('qs')

var app = connect()

app//.use(query())
   .use(function (req, res, next) {
     res.setHeader('Content-Type', 'application/json')
     res.end(JSON.stringify(req.query))
   })
   .listen(3001)