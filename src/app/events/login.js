var state = require('../state');
var User = require('../User');
var deck = require('../deck');
var score = require('../score');

module.exports = function (io, socket) {
  return function (name) {
    if (!name) {
      return;
    }

    io.emit('chat message', name + " is logged in");
    console.log(name, "has connected");
    if (state.userMap[socket.id] !== name) {
      state.userMap[socket.id] = name;
      if (!state.users.hasOwnProperty(name)) {
        state.users[name] = new User({
          name: name
        });
        state.users[name].hand = deck.dealAnswers(10);
      }
    }

    state.users[name].isActive = true;
    if (!state.round.czar.name) {
      state.round.czar = state.users[name];
      console.log("CZar!!!!", state.round.czar.name);
    }
    state.czarQueue.push(name);

    socket.emit('user', state.users[name]);
    socket.emit('roundUpdated', state.round);
    io.emit('scoreUpdated', score.scoreboard());
  };
};