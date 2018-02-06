const http     = require('http')
const path     = require('path')
const fs       = require('fs')
const qs       = require('querystring')
const mysql    = require('mysql')

const port     = 8787
const filePath = path.resolve(__dirname, './index.html')

const db = mysql.createConnection({
  host    : '127.0.0.1',
  user    : 'root',
  password: '940826',
  database: 'action'
})

const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'POST':
      addUser(req, res)
      break;
    
    case 'GET':
      showUser(res)
      break;
  
    default:
      break;
  }
})

db.query(
  "CREATE TABLE IF NOT EXISTS user(" +
    "id INT(10) NOT NULL AUTO_INCREMENT, " +
    "name LONGTEXT, " +
    "phone TINYTEXT, " +
    "PRIMARY KEY(id)" +
  ")",
  function (err) {
    if (err) throw err
    console.log(`Server started , listen at port ${port}...`)
    server.listen(port, '127.0.0.1')
  }
)

// 添加联系人
function addUser (req, res) {
  let user = ''
  req.on('data', (chunk) => {
    user += chunk
    user = qs.parse(user)
  })
  req.on('end', () => {
    insertUser(res, user)
  })
}

// 将联系人插入到数据库并显示 
function insertUser (res, user) {
  let isInsert = true
  db.query(
    "SELECT * FROM user",
    function (err, rows) {
      if (err) throw err
      for (let i in rows) {
        if (rows[i].name === user.name && rows[i].phone === user.phone) isInsert = false
      }
      // 防止将同一个联系人重复插入到数据库中
      if (isInsert) {
        db.query(
          "INSERT INTO user (name, phone) " + 
          " VALUES (?, ?)",
          [user.name, user.phone], 
          function(err) {
            if (err) throw err
            showUser(res)
          }
        )
      } else {
        showUser(res)
      }
    }
  )
}

// 显示联系人
function showUser (res) {
  db.query(
    "SELECT * FROM user ",
    function (err, rows) {
      if (err) throw err
      fs.readFile(filePath, (err, data) => {
        if (err) throw err
        let tmpl = data.toString()
        let dom  = listHtml(rows)
        let html = tmpl.replace('%user%', dom)
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(html)
      })
    }    
  )
}

function listHtml (rows) {
  let dom = '';
  for (let i in rows) { 
    dom += '<li>'
    dom += '<span> 姓名：' + rows[i].name + ' ，</span>';
    dom += '<span> 电话：' + rows[i].phone + '</span>';
    dom += '</li>';
  }
  return dom
}