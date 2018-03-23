var express = require('express')

var app = express()

var handlebars = require('express3-handlebars').create({ defaultLayout: 'main' })

var items = ['A', 'B', 'C', 'D']

app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

app.set('port', process.env.PORT || 3000)

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/about', (req, res) => {
  var randomItem = items[Math.floor(Math.random() * items.length)]
  res.render('about', {item: randomItem})
})

// 404 catch-all 处理器（中间件）
app.use((req, res, next) => {
  res.status(404)
  res.render('404')
})

// 500 错误处理器（中间件）
app.use((err, req, res, next) => {
  console.err(err.stack)
  res.status(500)
  res.render('500')
})

// app.get('/', (req, res) => {
//   res.type('text/plain')
//   res.send('Meadowlark Travel')
// })

// app.get('/about', (req, res) => {
//   res.type('text/plain')
//   res.send('About Meadowlark Travel')
// })

// // 定制404页面
// app.use((req, res) => {
//   res.type('text/plain')
//   res.status(404)
//   res.send('404 - Not Found')
// })

// // 定制500页面
// app.use((err, req, res, next) => {
//   console.err(err.stack)
//   res.type('text/plain')
//   res.status(500)
//   res.send('500 - Not Found')
// })

app.listen(app.get('port'), () => {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.')
})