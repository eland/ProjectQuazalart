var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var state = require('./app/state');
var deck = require('./app/deck');
var Round = require('./app/round');

var initGame = require('./app/actions/initGame');

var answerChosen = require('./app/events/answerChosen');
var answerSubmitted = require('./app/events/answerSubmitted');
var disconnect = require('./app/events/disconnect');
var login = require('./app/events/login');


initGame();

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.get('/app.js', function (req, res) {
  res.sendFile(__dirname + '/client/app.js');
});
app.get('/css/cards.css', function (req, res) {
  res.sendFile(__dirname + '/client/css/cards.css');
});

io.on('connection', function (socket) {
  socket.emit('authenticate');

  socket.on('login', login(io, socket));

  socket.on('disconnect', disconnect(io, socket));

  socket.on('chat message', function (msg) {
    console.log('message: ' + msg);
    io.emit('chat message', state.userMap[socket.id] + ': ' + msg);
  });

  socket.on('answerSubmitted', answerSubmitted(io, socket));

  socket.on('answerChosen', answerChosen(io));
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});