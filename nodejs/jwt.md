## JWT

JWT本质上它是一段签名的 JSON 格式的数据。由于它是带有签名的，因此接收者便可以验证它的真实性。同时由于它是 JSON 格式的因此它的体积也很小

## 应用场景

使用独立登录系统的时候，一般说来，大型应用会把授权的逻辑与用户信息的相关逻辑独立成一个应用，称为用户中心。用户中心不处理业务逻辑，只是处理用户信息的管理以及授权给第三方应用。第三方应用需要登录的时候，则把用户的登录请求转发给用户中心进行处理，用户处理完毕返回凭证，第三方应用验证凭证，通过后就登录用户。

例如这种情况下，用户信息和业务逻辑是分开在2台服务器之上，假设服务器A存放用户信息，服务器B存放业务逻辑，如果采用session存储登录状态，用户登录时在服务器A上验证成功，A服务器保存了session，可是用户接下来的操作是在服务器B上进行，服务器B怎么此时没有session怎么进行判断是哪个用户呢，这种情况下利用session就不是那么方便了。

## JWT 流程

- 用户向服务器A请求登录验证
- 服务器进行验证用户的信息
```javascript
let { email,password } = req.body;
let LoginPromise = UserModel.find({ 'email': email, 'password': $.md5(password) });  
//返回一个promise对象
//如果验证成功 利用jsonwebtoken生成token
module.exports.createToken = function (email) { //创建Token
  const token = jwt.sign({
    email
  },
  'secret', {
    expiresIn: '10s' // 过期时间 这里只设置10s
  })
  return token
}
```
- 客户端接受token 把token存放到cookie里面
```javascript
Cookies.set('Admin-Token', data.data.token)
```
- 用户向服务器 B 进行业务操作 就会携带该 token
- 服务器 B 通过请求头获取 token
```javascript
module.exports.checkToken = function (req, res, next) { // 从请求 cookie 中检查 token 的状态信息
  let re = /Admin-Token=(.+)/
  let token = req.headers.cookie.match(re)[1]    // 从 cookie 中提取出 token
  let decoded = jwt.verify(token, 'secret', function (err, decoded) { // jwt 解析
    if (err) {
      console.log(err)
      if (err.message === 'jwt expored') {
        return result(res, { success:false, msg: 'token过期，请重新登录' })
      }
      return result(res, { error: '登录信息有误' })
    }
    return result(res, { success:true, msg: 'token 正确' })
    // console.log(decoded)   
    //获取信息 进行下一步操作
    // next()
  })
}
```