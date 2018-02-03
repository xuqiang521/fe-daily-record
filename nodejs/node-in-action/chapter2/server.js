var http  = require("http");
var fs    = require("fs");
var path  = require("path");
var mime  = require("mime");
var cache = {};

// 所请求的文件不存在时发送404错误
function send404(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain' });
  response.write('Error 404: response not found');
  response.end();
}

// 提供文件数据服务
function sendFile(response, filePath, fileContents) {
  response.writeHead(200,
    {
      'Content-Type': mime.lookup(path.basename(filePath)),
    }
  );
  response.end(fileContents);
}

// 提供静态文件服务
function serveStatic(response, cache, absPath) {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function (exists) {
      if (exists) {
        fs.readFile(absPath, function (err, data) {
          console.log('readFile');
          if (err) {
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data);
          }
        })
      } else {
        send404(response);
      }
    })
  }
}

// 创建HTTP服务器的逻辑
var server = http.createServer(function (request, response) {
  var filePath = false;
  if (request.url == '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + request.url;
  }
  ;
  var absPath = './' + filePath;
  serveStatic(response, cache, absPath);
});

server.listen(3000, function () {
  console.log('server on localhost:3000');
});

var chatServer = require('./lib/chat-server');// 加载自定义模块
chatServer.listen(server);
