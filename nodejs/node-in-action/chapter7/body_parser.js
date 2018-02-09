var connect = require('connect')
var bodyParser = require('body-parser')

var app = connect()

app.use(bodyParser())
   .use(function (req, res) {
     console.log(req.body)
     console.log(req.files);
     res.end('thanks!')
   })
   .listen(3000)