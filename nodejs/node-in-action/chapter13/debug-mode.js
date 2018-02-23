var debug;
if (process.env.DEBUG) {
  debug = function (data) {
    console.error(data);
  }
} else {
  debug = function () {}
}

debug('this is a debug call')
console.log('Hello World')
debug('this is another debug call')