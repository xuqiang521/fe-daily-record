var connect = require('connect')
var compress = require('compression')
var static = require('serve-static')
 
var app = connect()

app
.use(compress({ 
  filter (req, res) {
    var type = res.getHeader('Content-Type') || ''
    console.log(type)
    return 0 === type.indexOf('text/plain')
  },
  level: 3,
  memLevel: 8 
}))
.use(static('public'))
.listen(3001)