var fs = require('fs')
var path = require('path')
var completedTasks = 0
var tasks = []
var wordCounts = {}
var filesDir = path.resolve(__dirname, './text')

function checkIfComplete () {
  console.log("-----checkIfComplete-----")
  completedTasks++
  if (completedTasks === tasks.length) {
    console.log(wordCounts)
    for (var index in wordCounts) {
      // 当所有任务完成后，列出文件中用到的单词以及用过的次数
      console.log(index + ': ' + wordCounts[index])
    }
  }
}

function countWordsInText (text) {
  var words = text
                .toString()
                .toLowerCase()
                .split(/\W+/)
                .sort()
  console.log("-----countWordsInText-----")
  console.log(words)
  for (var index in words) {
    var word = words[index]
    if (word) {
      wordCounts[word] = wordCounts[word] ? wordCounts[word] + 1 : 1
    }
  }
  console.log(wordCounts)
}

fs.readdir(filesDir, (err, files) => {
  if (err) throw err
  for (var index in files) {
    var task = (function (file) {
      return function () {
        fs.readFile(file, (err, text) => {
          if (err) throw err
          countWordsInText(text)
          checkIfComplete()
        })
      }
    })(filesDir + '/' + files[index])
    tasks.push(task)
  }
  for (var task in tasks) {
    tasks[task]()
  }
})