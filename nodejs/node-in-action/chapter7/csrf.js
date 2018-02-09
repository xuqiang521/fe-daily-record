var connect = require('connect')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var csrf = require('csurf')
 
var app = connect()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(csrf({ cookie: true }))
 
// error handler 
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
 
  // handle CSRF token errors here 
  res.status(403)
  res.send('form tampered with')
})

app.listen(3001)