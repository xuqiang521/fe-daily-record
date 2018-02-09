function setup (format) {
  var regexp = /:(\w)/g

  return function logger(req, res, next) {
    var str = format.replace(regexp, (match, property) => {
      return req[property]
    })

    console.log(str)

    next()
  }
}

module.exports = setup