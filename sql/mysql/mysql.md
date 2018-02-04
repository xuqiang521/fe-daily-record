## 一、MySQL 安装与基本配置

### 1、安装

> [MySQL 官方下载地址](https://dev.mysql.com/downloads/mysql/)


***注：千万记得，Mac版本得是>=10.13版本，低版本最后安装完之后不兼容，亲测有效，如果你的电脑版本低于10.13（我的之前是10.11），请先升级一下你的系统先***

### 2、密码重置

安装完之后，系统会给你一个随机生成的root密码，用来连接mysql服务的。但那密码不改成自己常用的一些密码能用？

#### step 1
- 系统偏好设置
- 最下边的MySQL
- 在弹出页面中 关闭mysql服务（点击stop mysql server）

#### step 2
- 进入终端输入 `cd /usr/local/mysql/bin/`
- 回车后登录管理员权限 `sudo su`
- 回车后输入一下命令来禁止mysql验证功能 `./mysqld_safe --skip-grant-tables &`
- 回车后mysql会自动重启（偏好设置中的mysql的状态会变成running）

#### step 3
- 输入命令 `./mysql`
- 回车后，输入命令 `FLUSH PRIVILEGES`
- 回车后，输入命令 `SET PASSWORD FOR 'root'@'localhost' = PASSWORD('你的新密码')`

好了，你的密码已经修改完毕，接下来要搞搞基本的配置了

### 3、基本配置

我们从上面修改密码可以看出来，并没有`mysql`的`command`指令，这还是有点不方便的。这里我们就来配置一下，具体步骤如下：

- 进入到 `.bash_profile` 文件: `vim ~/.bash_profile`
- 在 `.bash_profile` 文件中添加alias别名：
```bash
alias mysql=/usr/local/mysql/bin/mysql
alias mysqladmin=/usr/local/mysql/bin/mysqladmin
```
- 保存退出，执行`.bash_profile`文件：`source ~/.bash_profile`
- 执行：`mysql -uroot -p`，然后输入之前改好的密码

![](1.png)

如果你显示和上面一样，那么恭喜，你成功了。接下来就可以来进行mysql实战阶段了

## 2、数据库操作

1. 创建数据库
```bash
CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name [DEFAULT] CHARACTER SET [=] charset_name
```
2. 查看数据库
```bash
# 查看所有db
SHOW DATABASES
# 查看单个db信息
SHOW CREATE DATABASE db_name
```
3. 修改数据库
```bash
ALTER {DATABASE | SCHEMA} [db_name] [DEFAULT] CHARACTER SET [=] charset_name
```
4. 删除数据库
```bash
DROP {DATABASE | SCHEMA} [IF EXISTS] db_name
```
5. 选择数据库
```bash
USE {DATABASE | SCHEMA} [IF EXISTS] db_name
```