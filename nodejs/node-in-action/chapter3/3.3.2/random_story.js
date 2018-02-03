const fs = require('fs');
const path = require('path')
const request = require('request');
const htmlparser = require('htmlparser');
const configFilename = path.resolve(__dirname, './rss_feed.txt')

function checkForRSSFile () {
  fs.exists(configFilename, (exists) => {
    if (!exists) {
      return next(new Error('Missing RSS file：' + configFilename))
    }
    next(null, configFilename)
  })
}

function readRSSFile (configFilename) {
  fs.readFile(configFilename, (err, feedList) => {
    if (err) return next(err)

    feedList = feedList
                 .toString()
                 .replace(/^s+|\s+$/g, '')
                 .split('\n')
    let random = Math.floor(Math.random() * feedList.length)
    next(null, feedList[random])
  })
}

function downloadRSSFeed (feedUrl) {
  request({uri: feedUrl}, (err, res, body) => {
    if (err) return next(err)
    if (res.statusCode !== 200) return next(new Error('Abnormal response status code'))
    next(null, body)
  })
}

function parserRSSFeed (rss) {
  const handler = new htmlparser.RssHandler()
  const parser = new htmlparser.Parser(handler)
  parser.parseComplete(rss)
  if(!handler.dom.items.length){
    return next(new Error('No RSS items found'))
  }

  //如果有数据, 显示第一个预定源条目的标题和URL
  // const item = handler.dom.items.shift()
  console.log(handler.dom.items)
  // console.log("title: " + item.title)
  // console.log("link: " + item.link)
}

//把要做的任务按顺序添加到一个数组中
const tasks = [ checkForRSSFile, 
                readRSSFile, 
                downloadRSSFeed,
                parserRSSFeed ]

function next(err, result) {
  if(err) throw err;
  //从任务数组中取出下一个任务
  const currentTask = tasks.shift();
  if(currentTask){
    currentTask(result);    //执行当前任务
  }
};

next()