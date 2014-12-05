var state = require('../state');
var score = require('../score');
var clientState = require('../clientState');
var startRound = require('../actions/startRound');

module.exports = function (io, socket) {
  return function () {
    var name = state.userMap[socket.id];
    var queueIndex = state.czarQueue.indexOf(name);
    if (queueIndex > -1) {
      state.czarQueue.splice(queueIndex, 1);
    }
    if (state.round.czar.name === name) {
      startRound();
      clientState.currentRound = state.round;
      clientState.czar = state.round.czar.name;
    }
    if (state.users[name]) {
      state.users[name].isActive = false;
      delete state.userMap[socket.id];
      clientState.scoreboard = score.scoreboard();
      console.log(name, 'disconnected');
    }

    io.emit('roundUpdated', clientState);
  };
};