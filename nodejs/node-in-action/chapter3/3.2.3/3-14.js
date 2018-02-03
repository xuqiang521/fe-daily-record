function asyncFunc (callback, timeout = 1000) {
  setTimeout(callback, timeout);
}

var color = 'blue'
;(function (color) {
  asyncFunc(() => {
    console.log('The color is：' + color)
  })
})(color)
// asyncFunc(() => {
//   console.log('The color is：' + color)
// })

var color = 'green'