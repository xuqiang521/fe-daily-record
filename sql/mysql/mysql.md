## 一、MySQL 安装与基本配置

### 1、安装

> [MySQL 官方下载地址](https://dev.mysql.com/downloads/mysql/)

![](https://raw.githubusercontent.com/xuqiang521/fe-daily-record/master/sql/mysql/4.jpg)

![](https://raw.githubusercontent.com/xuqiang521/fe-daily-record/master/sql/mysql/3.jpg)

***注：千万记得，Mac版本得是>=10.13版本，低版本最后安装完之后不兼容，亲测有效，如果你的电脑版本低于10.13（我的之前是10.11），请先升级一下你的系统先***

![](https://raw.githubusercontent.com/xuqiang521/fe-daily-record/master/sql/mysql/2.jpg)

### 2、密码重置

安装完之后，系统会给你一个随机生成的root密码，用来连接mysql服务的。但那密码不改成自己常用的一些密码能用？

#### 1.2.1、step 1

- 系统偏好设置
- 最下边的MySQL
- 在弹出页面中 关闭mysql服务（点击stop mysql server）

#### 1.2.2、step 2

- 进入终端输入 `cd /usr/local/mysql/bin/`
- 回车后登录管理员权限 `sudo su`
- 回车后输入一下命令来禁止mysql验证功能 `./mysqld_safe --skip-grant-tables &`
- 回车后mysql会自动重启（偏好设置中的mysql的状态会变成running）

#### 1.2.3、step 3

- 输入命令 `./mysql`
- 回车后，输入命令 `FLUSH PRIVILEGES`
- 回车后，输入命令 `SET PASSWORD FOR 'root'@'localhost' = PASSWORD('你的新密码')`

好了，你的密码已经修改完毕，接下来要搞搞基本的配置了

### 3、基本配置

我们从上面修改密码可以看出来，并没有`mysql`的`command`指令，这还是有点不方便的。这里我们就来配置一下，具体步骤如下：

- 进入到 `.bash_profile` 文件: `vim ~/.bash_profile`
- 在 `.bash_profile` 文件中添加alias别名：

```bash
alias mysql=/usr/local/mysql/bin/mysql
alias mysqladmin=/usr/local/mysql/bin/mysqladmin
```

- 保存退出，执行`.bash_profile`文件：`source ~/.bash_profile`
- 执行：`mysql -uroot -p`，然后输入之前改好的密码

![](https://raw.githubusercontent.com/xuqiang521/fe-daily-record/master/sql/mysql/1.jpg)

如果你显示和上面一样，那么恭喜，你成功了。接下来就可以来进行mysql实战阶段了

## 二、实战操练

### 1、mysql 实操

***注意：下面列举出来的数据库操作是实战demo里面讲用到的一些操作，也是常见的一些操作***

1. 创建数据库

   ```mysql
   CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name [DEFAULT] CHARACTER SET [=] charset_name
   ```


1. 查看数据库

   ```mysql
   # 查看所有db
   SHOW DATABASES
   # 查看单个db信息
   SHOW CREATE DATABASE db_name
   ```


1. 修改数据库

   ```mysql
   ALTER {DATABASE | SCHEMA} [db_name] [DEFAULT] CHARACTER SET [=] charset_name
   ```


1. 删除数据库

   ```mysql
   DROP {DATABASE | SCHEMA} [IF EXISTS] db_name
   ```


1. 选择数据库

   ```mysql
   USE {DATABASE | SCHEMA} [IF EXISTS] db_name
   ```

2. 创建数据表

   ```mysql
   # 通用
   CERATE TABLE table_name (column_name column_type)
   # 比如
   CREATE TABLE IF NOT EXISTS `work` (
     `id` INT(10) NOT NULL AUTO_INCREMENT,
     `hours` DECIMAL(5,2) DEFAULT 0,
     `date` DATE,
     `archived` INT(1) DEFAULT 0,
     `description` LONGTEXT,
     PRIMARY KEY(`id`)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8
   ```

3. 删除数据表

   ```mysql
   # 通用
   DROP TABLE table_name
   ```

4. 插入数据

   ```mysql
   INSERT INTO table_name (field1, field2, ...fieldN)
   					    VALUES
   					   (value1, value2, ...valueN)
   ```

5. 查询数据

   ```mysql
   SELECT column_name, column_name
   FROM table_name
   [WHERE Clause]
   [LIMIT N][ OFFSET M]
   ```

6. UPDATE

   ```mysql
   UPDATE table_name SET field1=new-value1, field2=new-value2
   [WHERE Clause]
   ```

7. DELETE

   ```mysql
   DELETE FROM table_name [WHERE Clause]
   ```

### 2、nodejs 实操

本项目为 `demo` 项目，代码比较简单，适合入门。主要就是实现联系人的添加与查询，更多的需要小伙伴自己去拓展。

#### 2.2.1、项目结构

项目结构巨简单，如下（就三个文件）

```javascript
-- index.html   // 页面入口
-- package.json // 包依赖管理  
-- server.js	// 启动服务
```

#### 2.2.2、下载npm包

```bash
# 先初始化 package.json
npm init -y

# install mysql
npm i mysql -D
# 网络卡的话请使用 cnpm
cnpm i mysql -D
```

#### 2.2.3、index.html

这个文件内容也很简单，主要就是用来做展示的

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Node with MySQL</title>
</head>
<body>
  <form action="/" method="POST">
    姓名<input type="text" name="name">
    电话：<input type="text" name="phone">
    <input type="submit" value="ADD">
  </form>
  <!-- 展示数据库的用户信息 -->
  <ul>%user%</ul>
</body>
</html>
```

#### 2.2.4、server.js

实操部分在 `server.js` ，这里为了简洁，一些页面的操作也放到这了。

首先最重要的部分肯定启动服务，我们先启动服务，来访问 `index.html`

```javascript
const http = require('http')
const path = require('path')
const fs   = require('fs')

const port = 3000
const filePath = path.resolve(__dirname, './index.html')

const server = http.createServer((req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) throw err
    let html = data.toString()
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(html)
  })
})

server.listen(port, '127.0.0.1')
console.log(`Server started , listen at port ${port}...`)
```

启动服务，你就可以在 `http://localhost:3000` 访问到 `index.html` 了

```javascript
node server.js
```

然后我们需要连接数据库，在 `server.js` 加入以下代码

```javascript
const mysql = require('mysql')

const db = mysql.createConnection({
  host: 	'127.0.0.1',
  user:     'username',
  password: 'password',
  database: 'action'
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
    // 将上面服务启动代码挪到这
    server.listen(port, '127.0.0.1')
    console.log(`Server started , listen at port ${port}...`)
  }
)
```

连接数据库前，先建好名为 `action` 的 `database`

```mysql
CREATE DATABASE IF NOT EXISTS action DEFAULT CHARACTER SET = utf8
```

接下来我们得监听 `form` 表单的 `submit` 操作，将数据插入到数据库，新增 `add` 辅助函数

```javascript
function add (req, res) {
  let user = ''
  req.on('data', (chunk) => {
    user += chunk
  })
  req.on('end', () => {
    user = qs.parse(user)
    // 注意下面代码中的问号（？），它是用来指明应该吧参数放到哪里的占位符
    // 在添加到查询语句中之前，query 方法会自动把参数转义，防止 SQL 注入
    db.query(
      "INSERT INTO user (name, phone) " + 
      " VALUES (?, ?)",
      [user.name, user.phone], 
      function(err) {
        if (err) throw err;
        // 显示数据库中已有联系人
        show(res); 
      }
    )
  })
}
```

然后，完善 `show` 辅助函数

```javascript
function show (res) {
  db.query(
    "SELECT * FROM user ",
    function (err, rows) {
      if (err) throw err
      fs.readFile(filePath, (err, data) => {
        if (err) throw err
        let tmpl = data.toString()
        let dom = '';
        for(let i in rows) { 
          dom += '<li>'
          dom += '<span>' + rows[i].name + ' : </span>';
          dom += '<span>' + rows[i].phone + '</span>';
          dom += '</li>';
        }
        // 对模板进行处理 
        let html = tmpl.replace('%user%', dom)
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(html)
      })
    }    
  )
}
```

最后完整的 `server.js` 如下

```javascript
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
```

最后，执行 `server.js` ，然后你就可以添加联系人并在看到看到新增的联系人啦 ~