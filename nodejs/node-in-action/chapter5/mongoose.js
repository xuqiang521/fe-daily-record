var mongoose = require('mongoose')
var db = mongoose.connect('mongodb://localhost/tasks')

// 注册 schema
var Schema = mongoose.Schema
var Tasks = new Schema({
  project: String,
  description: String
})
mongoose.model('Task', Tasks)

var Task = mongoose.model('Task')
var task = new Task()
task.project = 'Bikeshed'
task.description = 'Paint the bikeshed red .'
task.save((err) => {
  if (err) throw err
  console.log('Task saved .')
})

var Task = mongoose.model('Task')
Task.find({'project': 'Bikeshed'}, (err, tasks) => {
  for (var i = 0; i < tasks.length; i++) {
    console.log('ID: '  + tasks[i]._id)
    console.log(tasks[i].description)
  }
})