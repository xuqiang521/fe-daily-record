var tobi = require('tobi');
var browser = tobi.createBrowser(3000, '127.0.0.1');

browser.get('/', function(res, $){
  $('form')
    .fill({ description: 'Floss the cat' })
    .submit(function(res, $) {
      $('td:nth-child(3)').text().should.equal('Floss the cat');
    });
});
