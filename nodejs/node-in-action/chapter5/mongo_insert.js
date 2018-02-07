var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
 
MongoClient.connect(url, function(err, db) {
  if (err) throw err
  // console.log("数据库已创建!")
  // var dbase = db.db('qdd')
  // dbase.createCollection('site', (err, res) => {
  //   if (err) throw err
  //   console.log('创建集合！')
  // })
  // db.close()
  var dbo = db.db("qdd");
  var myobj = { name: "test for mongodb", url: "localhost:27017/qdd" };
  dbo.collection("site").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("文档插入成功");
      db.close();
  });
});
