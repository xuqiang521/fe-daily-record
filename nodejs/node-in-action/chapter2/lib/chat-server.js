var socketio = require("socket.io");
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

// 启动 socketio 服务器
exports.listen = function (server) {
  io = socketio.listen(server); //  启动 socketio服务器,允许它搭载到已有的 http 服务器
  io.set('log level', 1);
  io.sockets.on('connection', function (socket) { // 定义每个用户连接的处理逻辑
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed); // 在用户连接上来时赋予其一个访客名

    joinRoom(socket, 'Lobby'); // 用户连接上时把他放入聊天室Lobby

    // 处理用户的消息, 更名以及聊天室的创建与变更
    handleMessageBroadcasting(socket, nickNames);
    handleNameChangeAttempts(socket, nickNames, namesUsed);
    handleRoomJoining(socket);

    // 用户发出请求时, 向其提供已被占用的聊天室列表
    socket.on('rooms', function () {
      socket.emit('rooms', io.sockets.manager.rooms);
    });

    // 定义用户断开连接后的清除逻辑
    handleClientDisconnection(socket, nickNames, namesUsed);
  });
};

// 分配用户昵称
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
  var name = 'Guest' + guestNumber; // 生成新昵称
  nickNames[socket.id] = name; // 把客户昵称与客户端连接ID关联
  socket.emit('nameResult', { // 让用户知道她们的昵称
    success: true,
    name: name,
  });
  namesUsed.push(name); // 存放已被占用的昵称
  return guestNumber + 1; // 增加用来生成昵称的计数器
}

// 与进入聊天室相关的逻辑
function joinRoom(socket, room) {
  socket.join(room); // 让用户进入房间
  currentRoom[socket.id] = room; // 记录用户的当前房间
  socket.emit('joinResult', { room: room }); // 让用户知道他们进入了新房间
  socket.broadcast.to(room).emit('message', { // 让房间里的其他用户知道有新用户进入
    text: nickNames[socket.id] + 'has joined' + room + '.',
  });

  var usersInRoom = io.sockets.clients(room); // 确定有哪些用户在房间里
  if (usersInRoom.length > 1) { // 如果不止一个用户在这个房间内,汇总一下都有谁
    var usersInRoomSummary = 'Users currently in ' + room + ':';
    for (var index in usersInRoom) {
      var userSocketId = usersInRoom[index].id;
      if (userSocketId != socket.id) {
        if (index > 0) {
          usersInRoomSummary += ', ';
        }
        usersInRoomSummary += nickNames[userSocketId];
      }
    }
    usersInRoomSummary += '.';
    socket.emit('message', {
      text: usersInRoomSummary,
    }); // 将房间里其他用户的汇总发送给这个用户
  }
}

// 更名请求的逻辑
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  socket.on('nameAttempt', function (name) { // 添加 nameAttempt 事件监听器
    if (name.indexOf('Guest') == 0) { // 昵称不能以Guest 开头
      socket.emit('nameResult', {
        success: false,
        message: 'Names can`t begin with "Guest"',
      });
    } else {
      if (namesUsed.indexOf(name) == -1) { // 如果昵称还没注册则执行注册
        var previousName = nickNames[socket.id];
        var previousNameIndex = namesUsed.indexOf(previousName);
        namesUsed.push(name);
        nickNames[socket.id] = name;
        delete namesUsed[previousNameIndex];
        // namesUsed.splice(previousNameIndex, 1);
        socket.emit('nameResult', {
          success: true,
          name: name,
        });
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: previousName + 'is now knows as ' + name + '.',
        })
      } else { // 如果昵称已被占用则提示用户
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use',
        })
      }
    }
  })
}

// 发送聊天消息
function handleMessageBroadcasting(socket, nickNames) {
  socket.on('message', function (message) {
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ": " + message.text,
    });
  });
}

// 创建房间
function handleRoomJoining(socket) {
  socket.on('join', function (room) {
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom);
  })
}

// 用户断开连接
function handleClientDisconnection(socket, nickNames, namesUsed) {
  socket.on('disconnect', function () {
    var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  })
}
