var hogan = require('hogan.js');
var md = require('github-flavored-markdown');

var template = '{{#markdown}}'
             + '**Name**: {{name}}'
             + '{{/markdown}}';

var context = {
  name: 'Rick LaRue',
  markdown: function() {
    return function(text) {
      return md.parse(text);
    };
  }
};

var template = hogan.compile(template);
console.log(template.render(context));
