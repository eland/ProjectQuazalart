var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var state = require('./app/state');
var deck = require('./app/deck');
var Round = require('./app/round');
var login = require('./app/actions/login');

deck.populate();
deck.shuffle();
var question = deck.dealQuestion();
var round = new Round({
  question: question
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/app.js', function (req, res) {
  res.sendFile(__dirname + '/client/app.js');
});

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.emit('authenticate');
  socket.emit('roundUpdated', round);

  socket.on('login', login(io, socket));

  socket.on('disconnect', function () {
    delete state.userMap[socket.id];
    console.log('user disconnected');
  });

  socket.on('chat message', function (msg) {
    console.log('message: ' + msg);
    io.emit('chat message', state.userMap[socket.id] + ': ' + msg);
  });

  socket.on('answerSubmitted', function (card) {
    var name = state.userMap[socket.id];
    if (state.users[name] && !round.submittedAnswers.hasOwnProperty(name)) {
      round.submittedAnswers[name] = card;
      var user = state.users[name];
      for (var i = 0; i < user.hand.length; i++) {
        if (card.id === user.hand[i].id) {
          user.hand.splice(i, 1);
          user.hand.push(deck.dealAnswers(1)[0]);
          socket.emit('user', user);
          break;
        }
      }
      io.emit('roundUpdated', round);
    }
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});