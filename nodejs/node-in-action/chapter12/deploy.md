## forever (deploy your code)

它能在你断开 SSH 连接后让程序继续保持运行状态，在程序崩溃退出后还能重启它

```bash
# 安装
sudo npm i -g forever
# 启动
forever start server.js
# 停止
forever stop server.js
# 获取管理的程序清单
forever list
# 启动并监听文件变更
forever -w start server.js
```
