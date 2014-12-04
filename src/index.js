var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var state = require('./app/state');
var User = require('./app/User');
var userMap = {};

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/app.js', function (req, res) {
  res.sendFile(__dirname + '/client/app.js');
});

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.emit('authenticate');
  socket.on('login', function (name) {
    if (name) {
      var newUser = new User({
        name: name
      });
      io.emit('chat message', newUser.name + " is logged in");
      userMap[socket.id] = newUser.name;
      state.users[name] = newUser;
    }
  });
  socket.on('disconnect', function () {
    delete userMap[socket.id];
    console.log('user disconnected');
  });
  socket.on('chat message', function (msg) {
    console.log('message: ' + msg);
    io.emit('chat message', userMap[socket.id] + ': ' + msg);
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});