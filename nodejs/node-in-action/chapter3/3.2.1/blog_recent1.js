var http = require('http')
var fs = require('fs')

var server = http.createServer((req, res) => {
  getTitle(res)
})
server.listen(3000, '127.0.0.1')

function getTitle (res) {
  fs.readFile('./title.json', (err, data) => {
    if (err) {
      handleError(err, res)
    } else {
      getTemplate(JSON.parse(data.toString()), res)
    }
  })
}

function getTemplate (titles, res) {
  fs.readFile('./template.html', (err, data) => {
    if (err) {
      handleError(err, res)
    } else {
      formatHtml(titles, data.toString(), res)
    }
  })
}

function formatHtml (titles, tmpl, res) {
  var html = tmpl.replace('%', titles.join('</li><li>'))
  res.writeHead(200, {'Content-type': 'text/html'})
  res.end(html)
}

function handleError (err, res) {
  console.log(err)
  res.end('Server Error')
}