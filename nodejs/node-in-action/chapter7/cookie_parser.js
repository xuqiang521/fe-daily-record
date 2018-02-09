var connect = require('connect')
var cookieParser = require('cookie-parser')

var app = connect()
app.use(cookieParser({tobi: 'tobi is a cool ferret'}))
   .use(function (req, res) {
     res.setHeader('Set-Cookie', 'foo=bar')
     res.setHeader('Set-Cookie', 'tobi=ferret; Expires=Wed Feb 07 2018 19:38:15 GMT+0800 (CST)')
    //  console.log(req)
    //  console.log(req.signedCookies)
     res.end()
   })
   .listen(3000)