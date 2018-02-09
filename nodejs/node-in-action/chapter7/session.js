var connect = require('connect')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var session = require('express-session')
// var redis = require('connect-redis')
// var RedisStore = redis(connect)
var app = connect()

var hour = 3600000
var sessionOpts = {
  key: 'myapp_sid',
  cookie: {maxAge: hour * 24, secure: true}
}

app
  // .use(favicon())
  .use(cookieParser('keyboard cat'))
  .use(session(sessionOpts))
  // .use(session({ store: new RedisStore({ prefix: 'sid' }) }))
  .use((req, res, next) => {
    var sess = req.session
    if (sess.id) {
      res.setHeader('Content-Type', 'text/html')
      res.write('<p>id: ' + sess.id + '</p>')
      res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + '</p>')
      res.write('<p>httpOnly: ' + sess.cookie.httpOnly + '</p>')
      res.write('<p>path: ' + sess.cookie.path + '</p>')
      res.write('<p>domain: ' + sess.cookie.domain + '</p>')
      res.write('<p>secure: ' + sess.cookie.secure + '</p>')
      res.end()
      sess.views++
    } else {
      sess.views = 1
      res.end('welcome to the session demo . refreshw!')
    }
    // req.session.cookie.maxAge = 3000
  })
  .listen(3001)