var redis = require('redis')

var client = redis.createClient(6379, '127.0.0.1')

client.on('error', (err) => {
  console.log(err)
})

client.set('color', 'red', redis.print)
client.get('color', (err, value) => {
  if (err) throw err
  console.log('Got：' + value)
})
// 设定哈希表元素 
client.hmset('camping', {
  'shelter': '2-person tent',
  'cooking': 'campstove'
}, redis.print)
// 获取元素 'cooking' 的值 
client.hget('camping', 'cooking', (err, value) => {
  if (err) throw err
  console.log('Will be cooking with：' + value)
})
// 获取哈希表的键 
client.hkeys('camping', (err, keys) => {
  if (err) throw err
  keys.forEach((key, index) => {
    console.log(' ' + key)
  })
})

client.lpush('tasks', 'Paint the bikeshed red .', redis.print)
client.lpush('tasks', 'Paint the bikeshed green .', redis.print)
client.lrange('tasks', 0, -1, (err, items) => {
  if (err) throw err
  items.forEach((item, i) => {
    console.log(' ' + item)
  })
})

client.sadd('ip_addresses', '204.10.37.96', redis.print)
client.sadd('ip_addresses', '204.10.37.96', redis.print)
client.sadd('ip_addresses', '72.32.231.8', redis.print)
client.smembers('ip_addresses', (err, members) => {
  if (err) throw err
  console.log(members)
})