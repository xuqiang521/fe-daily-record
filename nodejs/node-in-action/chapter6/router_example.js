var connect = require('connect')
var router = require('./middleware/router')

var routes = {
  GET: {
    '/users' (req, res) {
      res.end('tobi, loki, ferret')
    },
    '/users/:id' (req, res, id) {
      res.end('user ' + id)
    }
  },
  DELETE: {
    '/users/:id' (req, res, id) {
      res.end('delete user ' + id)
    }
  }
}

connect()
  .use(router(routes))
  .listen(3000)