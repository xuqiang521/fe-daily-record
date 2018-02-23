var elf = require('./node-elf');
var pathData = {};

var urlPath = '/article/cats';
console.log('URL path to shorten is: ' + urlPath);

// shorten URL path
var shortened = elf.shorten(pathData, urlPath);
console.log('Shortened URL path: /' + shortened);

// demonstrate URL expansion
var expanded = elf.expand(pathData, 1);
console.log('Shortned URL expands to: ' + expanded);
console.log(pathData.count + ' URL paths have been shortened.');