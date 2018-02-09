var connect = require('connect')
var bodyParser = require('body-parser')
var limit = require('limit').limit

var app = connect()

app
  .use(limit('32kb'))
  .use(bodyParser())

app.listen(3000)