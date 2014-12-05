var state = require('../state');
var score = require('../score');
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
      io.emit('roundUpdated', state.round);
    }
    if (state.users[name]) {
      state.users[name].isActive = false;
      delete state.userMap[socket.id];
      io.emit('scoreUpdated', score.scoreboard());
      console.log(name, 'disconnected');
    }
  };
};