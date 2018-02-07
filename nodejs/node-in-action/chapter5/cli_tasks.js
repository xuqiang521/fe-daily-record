var fs = require('fs')
var path = require('path')
var args = process.argv.splice(2)
var command = args.shift()
var taskDescription = args.join(', ')
var file = path.join(process.cwd(), '/.tasks')
console.log(file);
switch(command) {
  case 'list':
    listTasks(file)
    break;

  case 'add':
    addTask(file, taskDescription)
    break;

  default:
    console.log('Usage: ' + process.argv[0]
      + ' list|add [taskDescription]')
}

function loadOrInitializeTaskArray(file, cb) {
  fs.exists(file, (exists) => {
    var tasks = []
    if (exists) {
      fs.readFile(file, (err, data) => {
        if (err) throw err
        var data = data.toString()
        var tasks = JSON.parse(data || '[]')
        cb && cb(tasks)
      })
    } else {
      cb && cb([])
    }
  })
}

function listTasks (file) {
  loadOrInitializeTaskArray(file, (tasks) => {
    for (var i in tasks) {
      console.log(tasks[i])
    }
  })
}

function storeTasks (file, tasks) {
  fs.writeFile(file, JSON.stringify(tasks), 'utf8', (err) => {
    if (err) throw err
    console.log('Saved .')
  })
}

function addTask (file, taskDescription) {
  loadOrInitializeTaskArray(file, (tasks) => {
    tasks.push(taskDescription)
    storeTasks(file, tasks)
  })
}