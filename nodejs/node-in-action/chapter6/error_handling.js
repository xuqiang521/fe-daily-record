var connect = require('connect')

connect()
  .use(badMiddleware)
  .use(errorHandler)
  .listen(3000)

function badMiddleware(req, res, next) {
  next(new Error('Bad middleware makes error'));
}

function errorHandler () {
  var env = process.env.NODE_ENV || 'development'
  return function (err, req, res, next) {
    res.statusCode = 500

    switch (env) {
      case 'development':
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(err))
        break;
    
      default:
        res.end('Server Error')
        break;
    }
  }
}