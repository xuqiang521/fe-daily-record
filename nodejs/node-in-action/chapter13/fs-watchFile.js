var fs = require('fs')

fs.watchFile('./log/system.log', (curr, prev) => {
  if (curr.mtime.getTime() !== prev.mtime.getTime()) {
    console.log('system.log has been modified');
  }
})