var ejs = require('ejs')

var template = '<%- message %>'
var context = {message: "<script>alter('XSS attack')</script>"}

console.log(ejs.render(template, context))