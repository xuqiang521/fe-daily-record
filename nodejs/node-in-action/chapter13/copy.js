var fs = require('fs')

module.exports = function move (oldPath, newPath, callback) {
  fs.rename(oldPath, newPath, err => {
    if (err) {
      if (err.code === 'EXDEV') {
        copy()
      } else {
        callback(err)
      }
      return
    }
    callback && callback()
  })

  function copy () {
    var readStream = fs.createReadStream(oldPath)
    var writeStream = fs.createWriteStream(newPath)
    readStream.on('error', callback)
    writeStream.on('error', callback)
    readStream.on('close', () => {
      fs.unlink(oldPath, callback)
    })
    readStream.pipe(writeStream)
  }
}