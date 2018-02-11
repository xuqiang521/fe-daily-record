var db = [];

exports.save = function (doc, cb) {
  db.push(doc);
  if (cb) {
    setTimeout(() => {
      cb()
    }, 1000);
  }
}

exports.first = function (obj) {
  return db.filter(doc => {
    for (var key in obj) {
      if (doc[key] !== obj[key]) {
        return false;
      }
    }
    return true;
  }).shift();
}

exports.clear = function () {
  db = []
}