var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('error', { message: 'hello', error: { status: 400, stack: 'hehe' } });
});

module.exports = router;