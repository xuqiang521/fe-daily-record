var userName;
// 在用户页面中显示消息及可用房间
function divEscapedContentElement(message, isRoom) {
  if (isRoom) {
    return '<div id="message-content">' + message + '</div>'
  } else {
    return '<div>' +
            '<div id="userNameContent" class="text-info">' + userName + ':' + '</div>' +
            '<div id="message-content" class="text-warning">' + message + '</div>' +
            '</div>'
  }
}

function divSystemContentElement(message) {
  return $('<div id="systemMessage-content"></div>').html('<i>' + message + "</i>");
}

// 处理原始的用户输入
function processUserInput(chatApp, socket) {
  var message = $('#send-message').val();
  var systemMessage;

  if (message.charAt(0) == '/') { // 如果是用户输入的内容以斜杠开头, 将其作为聊天命令
    systemMessage = chatApp.processCommand(message);
    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage));
    }
  } else {
    // 将非命令输入广播给其他用户
    chatApp.sendMessage($('#room').text(), message);
    $('#messages').append(divEscapedContentElement(message));
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
  }
  $('#send-message').val('');
}

// 客户端程序初始化逻辑
console.log(io)
var socket = io.connect();
$(function () {
  var chatApp = new Chat(socket);

  // 显示更名尝试的结果
  socket.on('nameResult', function (result) {
    var message;

    if (result.success) {
      userName = result.name;
      message = '你的初始用户名为: ' + result.name + '.';
    } else {
      message = result.message;
    }
    ;
    $('#messages').append(divSystemContentElement(message));
  });

  // 显示房间变更的结果
  socket.on('joinResult', function (result) {
    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement('已进入房间: ' + result.room));
  });

  // 显示接收到的消息
  socket.on('message', function (message) {
    var newElement = $('<div></div>').text(message.text);
    $('#messages').append(newElement);
  });

  // 显示可用房间列表
  socket.on('rooms', function (rooms) {
    $('#room-list').empty();
    // debugger;

    for (var room in rooms) {
      room = room.substring(1, room.length);
      if (room != '') {
        $('#room-list').append(divEscapedContentElement(room, true));
      }
    }
    // 点击房间名可用换到那个房间中
    $('#room-list div').click(function () {
      chatApp.processCommand('/join ' + $(this).text());
      $('#send-message').focus();
    });
  });

  setInterval(function () {
    socket.emit('rooms')
  }, 1000);

  $('#send-message').focus();

  $('#send-form').submit(function () {
    processUserInput(chatApp, socket);
    return false;
  });
});
