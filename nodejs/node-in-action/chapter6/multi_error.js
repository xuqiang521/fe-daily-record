var connect = require('connect')

function hello (req, res, next) {
  if (req.url.match(/^\/hello/)) {
    res.end('hello world \n')
  } else {
    next()
  }
}

var db = {
  users: [
    {name: 'tobi'},
    {name: 'loki'},
    {name: 'jane'}
  ]
}

function users (req, res, next) {
  var match = req.url.match(/^\/user\/(.+)/)

  if (match) {
    var user = match[1]
    var isUser = hasUser(user, db.users)
    console.log(isUser, user)
    if (isUser) {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(user))
    } else {
      var err = new Error('User not found')
      err.notFound = true
      next(err)
    }
  } else {
    next()
  }
}

function hasUser (user, users) {
  let isUser = false
  users.forEach(item => {
    if (item.name === user) {
      isUser = true
    }
  })
  return isUser
}

function pets (req, res, next) {
  if (req.url.match(/^\/pets\/(.+)/)) {
    foo()
  } else {
    next()
  }
}

function errorHandler (err, req, res, next) {
  console.log(err.stack)
  res.setHeader('Content-Type', 'application/json')

  if (err.notFound) {
    res.statusCode = 404
    res.end(JSON.stringify({error: err.message}))
  } else {
    res.statusCode = 500
    res.end(JSON.stringify({error: 'Interval Server Error'}))
  }
}

connect()
  .use(users)
  .use(pets)
  .use(errorHandler)
  .use(hello)
  .listen(3000)