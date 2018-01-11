## session

session： 是一个抽象概念，开发者为了实现中断和继续等操作，将 user agent 和 server 之间一对一的交互，抽象为“会话”，进而衍生出“会话状态”，也就是 session 的概念

cookie：它是一个世纪存在的东西，http 协议中定义在 header 中的字段，可以认为是 session 的一种后端无状态实现

现在我们常说的 “session”，是为了绕开 cookie 的各种限制，通常借助 cookie 本身和后端存储实现的，一种更高级的会话状态实现

session 的常见实现要借助cookie来发送 sessionID