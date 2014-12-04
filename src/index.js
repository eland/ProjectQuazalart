var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var state = require('./app/state');
var deck = require('./app/deck');

var login = require('./app/actions/login');

deck.populate();
deck.shuffle();
deck.dealQuestion();

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/app.js', function (req, res) {
  res.sendFile(__dirname + '/client/app.js');
});

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.emit('authenticate');

  socket.on('login', login(io, socket));

  socket.on('disconnect', function () {
    delete state.userMap[socket.id];
    console.log('user disconnected');
  });

  socket.on('chat message', function (msg) {
    console.log('message: ' + msg);
    io.emit('chat message', state.userMap[socket.id] + ': ' + msg);
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});