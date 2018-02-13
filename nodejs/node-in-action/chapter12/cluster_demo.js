var cluster = require('cluster')
var http = require('http')
var numCPUs = require('os').cpus().length
console.log(cluster.isMaster);
if (cluster.isMaster) {
  // 每个内核创建一个 fork
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log('Worker ' + worker.process.pid + ' deid.');
  })
} else {
  http.Server((req, res) => {
    res.writeHead(200)
    res.end('I am a worker running in process ' + process.pid)
  }).listen(8000)
}