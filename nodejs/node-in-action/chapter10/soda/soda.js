var soda = require('soda')
var assert = require('assert');

var browser = soda.createClient({
  host: '127.0.0.1',
  port: 4444,
  url: 'http://www.reddit.com',
  browser: 'Chrome'
});

browser.on('command', function(cmd, args){
  console.log(cmd, args.join(', '));
});

browser
  .chain
  .session()
  .open('/')
  .type('user', 'mcantelon')
  .type('passwd', 'mahsecret')
  .clickAndWait('//button[@type="submit"]')
  .assertTextPresent('logout')
  .testComplete()
  .end(function(err){
    if (err) throw err;
    console.log('Done!');
  });
