var hogan = require('hogan.js')

var template = '{{ message }}'
var context = { message: 'hello template!' }

template = hogan.compile(template)
console.log(template.render(context));

var context1 = {
  students: [
    { name: 'Jane Narwhal', age: 21 },
    { name: 'Rick LaRue', age: 26 }
  ]
}

var template1 = `{{#students}}
<p>Name: {{ name }}, Age: {{age}} years old</p>
{{/students}}` 

template1 = hogan.compile(template1)
console.log(template1.render(context1));