// process.on('exit', (code) => {
//   console.log('Exiting...', code);
// })

process.on('uncaughtException', err => {
  console.error('got uncaught exception: ', err.message);
  process.exit(1)
})

throw new Error('an uncaught exception')

// process.on('SIGINT', () => {
//   console.log('Got Ctrl-C');
//   server.close()
// })