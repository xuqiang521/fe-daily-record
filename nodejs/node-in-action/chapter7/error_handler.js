var connect = require('connect')
var logger = require('morgan')
var errorHandler = require('errorhandler')

var app = connect()

app
  .use(logger('dev'))
  .use((req, res, next) => {
    setTimeout(() => {
      next(new Error('something broke !'))
    }, 500)
  })
  .use(errorHandler())
  .listen(3001)