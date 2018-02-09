var parse = require('url').parse

module.exports = function route (obj) {
  return function (req, res, next) {
    if (!obj[req.method]) {
      next()
      return
    }
    // 查找 req.method 对于的路径 
    var routes = obj[req.method]
    // 解析 URL，以便跟 pathname 匹配
    var url = parse(req.url)
    var paths = Object.keys(routes)

    for (var i = 0; i < paths.length; i++) {
      var path = paths[i]
      var fn = routes[path]
      path = path
               .replace(/\//g, '\\/')
               .replace(/:(\w+)/g, '([^\\/]+)')
      var reg = new RegExp('^' + path + '$')
      console.log(path)
      var captures = url.pathname.match(reg)
      console.log(url.pathname, captures)
      if (captures) {
        var args = [req, res].concat(captures.slice(1))
        fn.apply(null, args)
        return
      }
    }
    next()
  }
}