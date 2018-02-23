var fs = require('fs')
var cp = require('child_process')

// cp.execFile('ls', [ '-l', process.cwd() ], (err, stdout, stderr) => {
//   if (err) throw err
//   console.error(stdout)
// })

var child = cp.spawn('ls', ['-l'])

child.stdout.pipe(fs.createWriteStream('ls-result.txt'))

child.on('exit', (code, signal) => {
  // 子进程退出时发出
  console.log('hello exit');
})
