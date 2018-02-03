var events = require('events')
var util = require('util')
var fs = require('fs')
var path = require('path')
var watchDir = path.resolve(__dirname, './watch')
var processedDir = path.resolve(__dirname, './done')

function Watcher (watchDir, processedDir) {
  this.watchDir = watchDir
  this.processedDir = processedDir
}

util.inherits(Watcher, events.EventEmitter)

Watcher.prototype.watch = function () {
  var watcher = this
  fs.readdir(this.watchDir, (err, files) => {
    if (err) throw err
    console.log(files)
    for (var index in files) {
      watcher.emit('process', files[index])
    }
  })
}

Watcher.prototype.start = function () {
  var watcher = this
  fs.watchFile(watchDir, () => {
    watcher.watch()
  })
}

var watcher = new Watcher(watchDir, processedDir)

watcher.on('process', function process (file) {
  var watchFile = this.watchDir + '/' + file
  var processedFile = this.processedDir + '/' + file.toLowerCase()

  fs.rename(watchFile, processedFile, (err) => {
    if (err) throw err
  })
})

watcher.start()