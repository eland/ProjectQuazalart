var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var state = require('./app/state');
var deck = require('./app/deck');
var Round = require('./app/round');
var login = require('./app/actions/login');
var answerSubmitted = require('./app/actions/answerSubmitted');

function initGame() {
  deck.populate();
  deck.shuffle();
  state.newGame();
  state.round = new Round({
    question: deck.dealQuestion()
  });
}
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

  function startRound() {
    var newCzar = state.nextCzar();
    state.round = new Round({
      question: deck.dealQuestion(),
      czar: newCzar
    });
  }

  socket.on('disconnect', function () {
    var name = state.userMap[socket.id];
    var queueIndex = state.czarQueue.indexOf(name);
    if (queueIndex > -1) {
      state.czarQueue.splice(queueIndex, 1);
    }
    if (state.round.czar.name === name) {
      startRound();
      io.emit('roundUpdated', state.round);
    }
    if (state.users[name]) {
      state.users[name].isActive = false;
      delete state.userMap[socket.id];
      io.emit('scoreUpdated', state.getUserScores());
      console.log(name, 'disconnected');
    }
  });

  socket.on('chat message', function (msg) {
    console.log('message: ' + msg);
    io.emit('chat message', state.userMap[socket.id] + ': ' + msg);
  });

  socket.on('answerSubmitted', answerSubmitted(io, socket));

  socket.on('answerChosen', function (name) {
    state.users[name].score++;
    io.emit('scoreUpdated', state.getUserScores());
    if (state.users[name].score > 10) {
      io.emit("gameOver", name);
      initGame();
      return;
    } else {
      startRound();

      console.log('answer chosen! Round winner:', name);
      io.emit('roundUpdated', state.round);
    }
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});